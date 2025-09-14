import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('🔄 Sync endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle GET request - retrieve user data
  if (req.method === 'GET') {
    const { emailHash } = req.query;
    const authHeader = req.headers.authorization;

    // For premium users with session tokens
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const sessionToken = authHeader.substring(7);

      try {
        let userData = null;

        // Handle development sessions
        if (sessionToken.startsWith('dev-session-token-')) {
          console.log('🚧 Development session sync - returning empty data');
          userData = {
            data: { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false, firstName: 'Dev User' } },
            firstName: 'Dev User',
            language: 'en',
            timestamp: Date.now().toString(),
            lastSync: new Date().toISOString(),
            version: '1.0.0'
          };
        } else {
          // Find user by session token in Redis
          const userKeys = await redis.keys('sn:u:*');

          for (const userKey of userKeys) {
            // Skip legacy sync keys - only check user data keys
            if (userKey.includes('sn:u:sync:')) continue;

            const user = await redis.hgetall(userKey);
            if (user.session_token === sessionToken) {
              // Return user's cloud data
              userData = {
                data: JSON.parse(user.app_data || '{}'),
                firstName: user.first_name || '',
                language: 'en',
                timestamp: user.last_active,
                lastSync: new Date().toISOString(),
                version: '1.0.0'
              };
              break;
            }
          }
        }

        if (!userData) {
          return res.status(404).json({ error: 'Session not found' });
        }

        console.log('✅ Premium data retrieved for session');
        return res.json(userData);

      } catch (error) {
        console.error('❌ Premium sync retrieve error:', error);
        return res.status(500).json({ error: 'Failed to retrieve premium data' });
      }
    }

    // No legacy users - authentication required
    return res.status(401).json({ error: 'Authentication required - no legacy access' });
  }

  // Handle POST request - store user data
  if (req.method === 'POST') {
    let body;

    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    const authHeader = req.headers.authorization;

    // For premium users with session tokens
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const sessionToken = authHeader.substring(7);
      const { email, data, firstName, syncType } = body;

      if (!email || !sessionToken) {
        return res.status(400).json({ error: 'Email and session token required for authenticated sync' });
      }

      try {
        // Handle development sessions
        if (sessionToken.startsWith('dev-session-token-')) {
          console.log('🚧 Development session - simulating successful cloud save:', {
            taskCount: data?.tasks?.length || 0,
            syncType,
            hasFirstName: !!firstName
          });

          return res.json({
            success: true,
            timestamp: Date.now(),
            premium: true,
            message: 'Development session - data saved to localStorage only'
          });
        }

        // Find and update user by session token in Redis
        const userKey = `sn:u:${email}`;
        const redisStartTime = Date.now();

        console.log('🔍 REDIS OPERATION - FIND USER', {
          operation: 'hgetall',
          key: userKey,
          timestamp: new Date().toISOString(),
          sessionTokenProvided: sessionToken.substring(0, 8) + '...'
        });

        const user = await redis.hgetall(userKey);
        const userFetchTime = Date.now() - redisStartTime;

        console.log('📦 REDIS USER FETCH RESULT', {
          userExists: !!user && !!user.email,
          hasSessionToken: !!user.session_token,
          sessionTokenMatch: user.session_token === sessionToken,
          existingDataSize: user.app_data ? user.app_data.length : 0,
          existingDataSizeKB: user.app_data ? (user.app_data.length / 1024).toFixed(2) + 'KB' : '0KB',
          lastActive: user.last_active ? new Date(parseInt(user.last_active)).toISOString() : 'never',
          firstName: user.first_name || 'none',
          tier: user.tier || 'unknown',
          fetchTimeMs: userFetchTime + 'ms'
        });

        if (!user.session_token || user.session_token !== sessionToken) {
          console.log('❌ REDIS AUTH FAILED', {
            reason: !user.session_token ? 'no session token in Redis' : 'session token mismatch',
            providedToken: sessionToken.substring(0, 8) + '...',
            storedToken: user.session_token ? user.session_token.substring(0, 8) + '...' : 'none'
          });
          return res.status(403).json({ error: 'Invalid session token' });
        }

        // CRITICAL SAFETY CHECK: Prevent overwriting existing data with empty data
        const existingDataSize = user.app_data ? user.app_data.length : 0;
        const newTaskCount = data?.tasks?.length || 0;
        const existingTaskCount = user.app_data ? (JSON.parse(user.app_data || '{}').tasks || []).length : 0;

        // Block sync if trying to overwrite existing tasks with empty data
        if (existingTaskCount > 0 && newTaskCount === 0) {
          console.error('🚨 CRITICAL DATA PROTECTION: Blocked attempt to overwrite', existingTaskCount, 'tasks with empty data');
          return res.status(409).json({
            error: 'Data protection: Cannot overwrite existing tasks with empty data',
            protection: 'critical_data_loss_prevention',
            existingTasks: existingTaskCount,
            newTasks: newTaskCount,
            suggestion: 'Use force=true parameter if this is intentional'
          });
        }

        const newAppData = JSON.stringify(data || {});
        const newDataSize = newAppData.length;
        const newDataSizeKB = (newDataSize / 1024).toFixed(2);
        const dataSizeDelta = user.app_data ? newDataSize - user.app_data.length : newDataSize;

        console.log('📤 REDIS OPERATION - UPDATE USER DATA', {
          operation: 'hset',
          key: userKey,
          newDataSize: newDataSize + ' bytes',
          newDataSizeKB: newDataSizeKB + 'KB',
          dataSizeDelta: dataSizeDelta + ' bytes',
          taskCount: data?.tasks?.length || 0,
          historyEntries: data?.history?.length || 0,
          badgeCount: data?.badges?.length || 0,
          patternsKeys: data?.patterns ? Object.keys(data.patterns).length : 0,
          timestamp: Date.now()
        });

        // Update user data in Redis
        const updateStartTime = Date.now();
        await redis.hset(userKey, {
          app_data: newAppData,
          first_name: firstName || user.first_name || '',
          last_active: Date.now().toString(),
          synced_from_local: syncType === 'initial' ? Date.now().toString() : user.synced_from_local || null
        });
        const updateTime = Date.now() - updateStartTime;

        console.log('✅ REDIS WRITE SUCCESS - DATA STORED TO CLOUD', {
          redisKey: userKey,
          operationTimeMs: updateTime + 'ms',
          totalRedisTimeMs: (Date.now() - redisStartTime) + 'ms',
          dataWritten: newDataSizeKB + 'KB',
          tasksSaved: data?.tasks?.length || 0,
          firstName: firstName || user.first_name || 'none',
          syncType: syncType || 'update',
          timestamp: new Date().toISOString(),
          redisOperationSuccess: true
        });

        return res.json({
          success: true,
          timestamp: Date.now(),
          synced: new Date().toISOString(),
          premium: true
        });

      } catch (error) {
        console.error('❌ Premium sync store error:', error);
        return res.status(500).json({ error: 'Failed to sync premium data' });
      }
    }

    // No legacy users - authentication required
    return res.status(401).json({ error: 'Authentication required - no legacy access' });
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}