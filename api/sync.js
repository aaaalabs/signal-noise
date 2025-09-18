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
  console.log('🔄 Sync endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle GET request - retrieve user data
  if (req.method === 'GET') {
    const { emailHash } = req.query;
    const authHeader = req.headers.authorization;

    // For premium users with access tokens
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);

      try {
        let userData = null;

        // Handle development sessions
        if (accessToken.startsWith('dev-session-token-')) {
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
          // Simple token validation: find user with matching access_token
          const userKeys = await redis.keys('sn:u:*');

          for (const userKey of userKeys) {
            if (userKey.includes(':sessions')) continue; // Skip session lists

            const user = await redis.hgetall(userKey);
            if (user.access_token === accessToken && user.status === 'active') {
              // Return user's cloud data with corrupted data protection
              let parsedData = {};

              // Handle missing app_data field (new users)
              if (!user.app_data) {
                console.log('🆕 New user without app_data - initializing:', userKey);
                parsedData = { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false } };

                // Initialize app_data for new user
                await redis.hset(userKey, {
                  app_data: JSON.stringify(parsedData),
                  app_data_initialized: new Date().toISOString()
                });
                console.log('✅ App data initialized for new user:', userKey);
              } else {
                // Upstash returns app_data as object directly
                parsedData = user.app_data || { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false } };
                console.log('📦 Using app_data object from Upstash');
              }

              userData = {
                data: parsedData,
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

    // For premium users with access tokens
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      const { email, data, firstName, syncType } = body;

      if (!email || !accessToken) {
        return res.status(400).json({ error: 'Email and access token required for authenticated sync' });
      }

      try {
        // Handle development sessions
        if (accessToken.startsWith('dev-session-token-')) {
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

        // Simple token validation: find user with matching access_token
        const userKey = `sn:u:${email}`;
        const redisStartTime = Date.now();

        console.log('🔍 REDIS OPERATION - FIND USER', {
          operation: 'hgetall',
          key: userKey,
          timestamp: new Date().toISOString(),
          accessTokenProvided: accessToken.substring(0, 8) + '...'
        });

        const user = await redis.hgetall(userKey);
        const userFetchTime = Date.now() - redisStartTime;

        console.log('📦 REDIS USER FETCH RESULT', {
          userExists: !!user && !!user.email,
          hasAccessToken: !!user.access_token,
          accessTokenMatch: user.access_token === accessToken,
          existingDataSize: getDataSize(user.app_data),
          existingDataSizeKB: getDataSize(user.app_data) ? (getDataSize(user.app_data) / 1024).toFixed(2) + 'KB' : '0KB',
          lastActive: user.last_active ? new Date(parseInt(user.last_active)).toISOString() : 'never',
          firstName: user.first_name || 'none',
          tier: user.tier || 'unknown',
          fetchTimeMs: userFetchTime + 'ms'
        });

        if (!user.access_token || user.access_token !== accessToken || user.status !== 'active') {
          console.log('❌ REDIS AUTH FAILED', {
            reason: !user.access_token ? 'no access token in Redis' :
                   user.access_token !== accessToken ? 'access token mismatch' :
                   'user not active',
            providedToken: accessToken.substring(0, 8) + '...',
            storedToken: user.access_token ? user.access_token.substring(0, 8) + '...' : 'none'
          });
          return res.status(403).json({ error: 'Invalid access token' });
        }

        // CRITICAL SAFETY CHECK: Prevent overwriting existing data with empty data
        const existingDataSize = getDataSize(user.app_data);
        const newTaskCount = data?.tasks?.length || 0;

        let existingTaskCount = 0;

        // Handle missing app_data field (new users)
        if (!user.app_data) {
          console.log('🆕 New user without app_data during POST - initializing:', userKey);
          existingTaskCount = 0;
        } else {
          // Upstash returns app_data as object directly
          const existingData = user.app_data || { tasks: [] };
          existingTaskCount = (existingData.tasks || []).length;
        }

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
        const dataSizeDelta = user.app_data ? newDataSize - getDataSize(user.app_data) : newDataSize;

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

        // Get current version and increment
        const currentVersion = parseInt(user.version || '0');
        const newVersion = currentVersion + 1;

        // Get device info from user agent
        const userAgent = req.headers['user-agent'] || '';
        let deviceType = 'Desktop';
        if (userAgent.includes('iPhone')) deviceType = 'iPhone';
        else if (userAgent.includes('iPad')) deviceType = 'iPad';
        else if (userAgent.includes('Android')) deviceType = 'Android';
        else if (userAgent.includes('Mac')) deviceType = 'Mac';

        // Update user data in Redis with version tracking
        const updateStartTime = Date.now();
        await redis.hset(userKey, {
          app_data: newAppData,
          first_name: firstName || user.first_name || '',
          last_active: Date.now().toString(),
          version: newVersion.toString(),
          last_modified: Date.now().toString(),
          last_device: deviceType,
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
          version: `${currentVersion} → ${newVersion}`,
          device: deviceType,
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