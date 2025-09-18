import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('📊 Sync metadata endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const accessToken = authHeader.substring(7);

  try {
    // Handle development sessions
    if (accessToken.startsWith('dev-session-token-')) {
      console.log('🚧 Development session - returning mock metadata');
      return res.json({
        version: 0,
        lastModified: Date.now(),
        lastDevice: 'Development',
        taskCount: 0
      });
    }

    // Simple token validation: find user with matching access_token
    const userKeys = await redis.keys('sn:u:*');
    let userData = null;

    for (const userKey of userKeys) {
      if (userKey.includes(':sessions')) continue; // Skip session lists

      const user = await redis.hgetall(userKey);
      if (user.access_token === accessToken && user.status === 'active') {
        userData = user;
        break;
      }
    }

    if (!userData) {
      return res.status(403).json({ error: 'Invalid access token' });
    }

    // Return minimal metadata for version checking
    const metadata = {
      version: parseInt(userData.version || '0'),
      lastModified: parseInt(userData.last_modified || userData.last_active || '0'),
      lastDevice: userData.last_device || 'Unknown'
    };

    // Optional: include task count for UI hints
    if (userData.app_data) {
      try {
        const appData = typeof userData.app_data === 'string' ?
          JSON.parse(userData.app_data) : userData.app_data;
        metadata.taskCount = appData.tasks?.length || 0;
      } catch (e) {
        metadata.taskCount = 0;
      }
    }

    console.log('✅ Metadata returned:', {
      version: metadata.version,
      device: metadata.lastDevice,
      age: Date.now() - metadata.lastModified + 'ms ago'
    });

    return res.json(metadata);

  } catch (error) {
    console.error('❌ Sync metadata error:', error);
    return res.status(500).json({ error: 'Failed to retrieve metadata' });
  }
}