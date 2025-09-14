import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('📋 Tasks endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const sessionToken = authHeader.substring(7);

  try {
    console.log('🔍 Tasks endpoint - session validation:', {
      sessionTokenPresent: !!sessionToken,
      sessionTokenLength: sessionToken?.length,
      sessionTokenPreview: sessionToken?.substring(0, 8) + '...'
    });

    let userKey = null;
    let user = null;

    // Handle development sessions
    if (sessionToken.startsWith('dev-session-token-')) {
      console.log('🚧 Development session - using mock user data');
      userKey = 'sn:u:dev@signal-noise.test';
      user = {
        email: 'dev@signal-noise.test',
        first_name: 'Dev User',
        tier: 'early_adopter',
        status: 'active',
        app_data: '{"tasks":[],"history":[],"badges":[],"patterns":{},"settings":{"targetRatio":80,"notifications":false,"firstName":"Dev User"}}'
      };
    } else {
      // Find user by session token in Redis
      console.log('🔍 Searching for user with session token...');
      const userKeys = await redis.keys('sn:u:*');
      console.log(`🔍 Found ${userKeys.length} user keys in Redis:`, userKeys);

      for (const key of userKeys) {
        try {
          // Skip keys that don't follow the user pattern
          if (!key.startsWith('sn:u:') || key.includes(':sync:')) {
            console.log(`⏭️ Skipping non-user key: ${key}`);
            continue;
          }

          const userData = await redis.hgetall(key);
          console.log(`🔍 Checking key: ${key}`, {
            hasSessionToken: !!userData.session_token,
            sessionTokenMatch: userData.session_token === sessionToken,
            userEmail: userData.email,
            status: userData.status
          });

          if (userData.session_token === sessionToken) {
            console.log('✅ Session token match found!', key);
            userKey = key;
            user = userData;
            break;
          }
        } catch (keyError) {
          console.log(`⚠️ Error checking key ${key}:`, keyError.message, '- skipping');
          continue;
        }
      }

      console.log('🔍 Session token search result:', {
        userFound: !!user,
        userKey: userKey,
        userEmail: user?.email
      });
    }

    if (!user) {
      return res.status(403).json({ error: 'Invalid session token' });
    }

    // Parse current app data
    let appData = {};
    try {
      appData = JSON.parse(user.app_data || '{}');
    } catch (error) {
      console.error('🚨 CORRUPTED APP_DATA IN TASKS:', {
        userKey: userKey,
        userEmail: user.email,
        dataType: typeof user.app_data,
        dataPreview: user.app_data ? (typeof user.app_data === 'string' ? user.app_data.substring(0, 100) : JSON.stringify(user.app_data).substring(0, 100)) : 'null',
        error: error.message
      });
      appData = { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false } };

      // Fix corrupted data in background (skip for dev sessions)
      if (!sessionToken.startsWith('dev-session-token-')) {
        await redis.hset(userKey, {
          app_data: JSON.stringify(appData),
          data_corruption_fixed: new Date().toISOString()
        });
        console.log('🔧 Corrupted data reset during TASKS for', userKey);
      }
    }

    // Handle GET request - retrieve tasks
    if (req.method === 'GET') {
      console.log('✅ Tasks retrieved for user:', user.email);
      return res.json({
        success: true,
        data: appData,
        premium: true
      });
    }

    // Handle POST request - add new task
    if (req.method === 'POST') {
      const { task } = req.body;

      if (!task || !task.text || !task.type) {
        return res.status(400).json({ error: 'Task text and type required' });
      }

      // Add new task
      const newTask = {
        id: Date.now(),
        text: task.text.trim(),
        type: task.type,
        timestamp: new Date().toISOString(),
        completed: false
      };

      if (!appData.tasks) appData.tasks = [];
      appData.tasks.unshift(newTask);

      // Update user data in Redis (skip for dev sessions)
      if (!sessionToken.startsWith('dev-session-token-')) {
        await redis.hset(userKey, {
          app_data: JSON.stringify(appData),
          last_active: Date.now().toString()
        });
      } else {
        console.log('🚧 Development session - skipping Redis save, data saved locally only');
      }

      console.log('✅ Task added for user:', user.email, newTask.type);
      return res.json({
        success: true,
        task: newTask,
        premium: true
      });
    }

    // Handle PUT request - update task
    if (req.method === 'PUT') {
      const { taskId, updates } = req.body;

      if (!taskId) {
        return res.status(400).json({ error: 'Task ID required' });
      }

      if (!appData.tasks) appData.tasks = [];

      // Find and update task
      const taskIndex = appData.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Apply updates
      appData.tasks[taskIndex] = {
        ...appData.tasks[taskIndex],
        ...updates
      };

      // Update user data in Redis (skip for dev sessions)
      if (!sessionToken.startsWith('dev-session-token-')) {
        await redis.hset(userKey, {
          app_data: JSON.stringify(appData),
          last_active: Date.now().toString()
        });
      } else {
        console.log('🚧 Development session - skipping Redis save, data saved locally only');
      }

      console.log('✅ Task updated for user:', user.email, taskId);
      return res.json({
        success: true,
        task: appData.tasks[taskIndex],
        premium: true
      });
    }

    // Handle DELETE request - remove task
    if (req.method === 'DELETE') {
      const { taskId } = req.query;

      if (!taskId) {
        return res.status(400).json({ error: 'Task ID required' });
      }

      if (!appData.tasks) appData.tasks = [];

      // Filter out the task
      const originalLength = appData.tasks.length;
      appData.tasks = appData.tasks.filter(task => task.id !== parseInt(taskId));

      if (appData.tasks.length === originalLength) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Update user data in Redis (skip for dev sessions)
      if (!sessionToken.startsWith('dev-session-token-')) {
        await redis.hset(userKey, {
          app_data: JSON.stringify(appData),
          last_active: Date.now().toString()
        });
      } else {
        console.log('🚧 Development session - skipping Redis save, data saved locally only');
      }

      console.log('✅ Task deleted for user:', user.email, taskId);
      return res.json({
        success: true,
        deleted: parseInt(taskId),
        premium: true
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Tasks endpoint error:', error);
    return res.status(500).json({ error: 'Failed to process task operation' });
  }
}