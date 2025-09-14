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

    // Legacy hash-based retrieval for free users
    if (!emailHash) {
      return res.status(400).json({ error: 'Email hash or authentication required' });
    }

    try {
      const userData = await redis.get(`sn:u:sync:${emailHash}`);

      if (!userData) {
        return res.status(404).json({ error: 'No data found' });
      }

      console.log('✅ Data retrieved for hash:', emailHash.substring(0, 6) + '...');
      return res.json(userData);

    } catch (error) {
      console.error('❌ Sync retrieve error:', error);
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
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
        const user = await redis.hgetall(userKey);

        if (!user.session_token || user.session_token !== sessionToken) {
          return res.status(403).json({ error: 'Invalid session token' });
        }

        // Update user data in Redis
        await redis.hset(userKey, {
          app_data: JSON.stringify(data || {}),
          first_name: firstName || user.first_name || '',
          last_active: Date.now().toString(),
          synced_from_local: syncType === 'initial' ? Date.now().toString() : user.synced_from_local || null
        });

        console.log('✅ Premium data synced for user:', email, {
          taskCount: data?.tasks?.length || 0,
          syncType,
          hasFirstName: !!firstName
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

    // Legacy hash-based sync for free users
    const { emailHash, data, firstName, language, timestamp } = body;

    if (!emailHash) {
      return res.status(400).json({ error: 'Email hash or authentication required' });
    }

    try {
      const syncData = {
        data: data || {},
        firstName: firstName || '',
        language: language || 'en',
        timestamp: timestamp || Date.now(),
        lastSync: new Date().toISOString(),
        version: '1.0.0'
      };

      // Store in Redis with TTL of 1 year (31536000 seconds)
      await redis.setex(`sn:u:sync:${emailHash}`, 31536000, JSON.stringify(syncData));

      console.log('✅ Data synced for hash:', emailHash.substring(0, 6) + '...', {
        taskCount: data?.tasks?.length || 0,
        hasFirstName: !!firstName,
        language
      });

      return res.json({
        success: true,
        timestamp: syncData.timestamp,
        synced: syncData.lastSync
      });

    } catch (error) {
      console.error('❌ Sync store error:', error);
      return res.status(500).json({ error: 'Failed to sync data' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}