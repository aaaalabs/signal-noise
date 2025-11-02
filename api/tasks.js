import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Helper function to calculate size of app_data (handles both object and string types)
function getDataSize(appData) {
  if (!appData) return 0;
  if (typeof appData === 'string') return appData.length;
  if (typeof appData === 'object') return JSON.stringify(appData).length;
  return 0;
}

export default async function handler(req, res) {
  console.log('📋 Tasks endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const accessToken = authHeader.substring(7);

  try {
    console.log('🔍 Tasks endpoint - token validation:', {
      accessTokenPresent: !!accessToken,
      accessTokenLength: accessToken?.length,
      accessTokenPreview: accessToken?.substring(0, 8) + '...'
    });

    let userKey = null;
    let user = null;

    // Handle development sessions
    if (accessToken.startsWith('dev-session-token-')) {
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
      // Simple token validation: find user with matching access_token
      console.log('🔍 Searching for user with access token...');
      const userKeys = await redis.keys('sn:u:*');

      for (const key of userKeys) {
        if (key.includes(':sessions')) continue; // Skip session lists

        const userData = await redis.hgetall(key);
        if (userData.access_token === accessToken && userData.status === 'active') {
          userKey = key;
          user = userData;
          console.log('✅ Access token validated for user:', userData.email);
          break;
        }
      }

      console.log('🔍 Access token search result:', {
        userFound: !!user,
        userKey: userKey,
        userEmail: user?.email
      });
    }

    if (!user) {
      return res.status(403).json({ error: 'Invalid access token' });
    }

    // Parse current app data
    let appData = {};

    // Handle missing app_data field (new users)
    if (!user.app_data) {
      console.log('🆕 New user without app_data in TASKS - initializing:', userKey);
      appData = { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false } };

      // Initialize app_data for new user (skip for dev sessions)
      if (!accessToken.startsWith('dev-session-token-')) {
        await redis.hset(userKey, {
          app_data: JSON.stringify(appData),
          app_data_initialized: new Date().toISOString()
        });
        console.log('✅ App data initialized for new user in TASKS:', userKey);
      }
    } else {
      // Upstash returns app_data as object directly
      appData = user.app_data || { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false } };
      console.log('📦 Using app_data object from Upstash in TASKS');
    }

    // Handle GET request - retrieve tasks
    if (req.method === 'GET') {
      console.log('✅ Tasks retrieved for user:', user.email);

      // CRITICAL FIX: Return version atomically with data to prevent race conditions
      const version = parseInt(user.version || '0');
      console.log('📦 Including version in response:', version);

      // CRITICAL: Disable ALL caching for dynamic user data
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      return res.json({
        success: true,
        data: appData,
        premium: true,
        version: version  // ATOMIC: Version matches the data being returned
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
      if (!accessToken.startsWith('dev-session-token-')) {
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
      if (!accessToken.startsWith('dev-session-token-')) {
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

      // SLC FIX: Find task and validate 30-minute deletion window
      const taskToDelete = appData.tasks.find(task => task.id === parseInt(taskId));

      if (!taskToDelete) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // 30-MINUTE DELETION WINDOW CHECK (Backend enforcement)
      const taskDate = new Date(taskToDelete.timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - taskDate.getTime()) / 60000);

      if (diffMinutes >= 30) {
        console.log('⛔ Task deletion blocked - outside 30min window:', {
          taskId: taskToDelete.id,
          taskAge: diffMinutes,
          lockWindow: 30
        });

        return res.status(403).json({
          error: 'Task is locked - cannot delete after 30 minutes',
          taskAge: diffMinutes,
          lockWindow: 30,
          taskText: taskToDelete.text
        });
      }

      // Filter out the task (deletion allowed within 30 minutes)
      const originalLength = appData.tasks.length;
      appData.tasks = appData.tasks.filter(task => task.id !== parseInt(taskId));

      if (appData.tasks.length === originalLength) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Update user data in Redis (skip for dev sessions)
      if (!accessToken.startsWith('dev-session-token-')) {
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