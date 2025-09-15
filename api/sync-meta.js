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

  const sessionToken = authHeader.substring(7);

  try {
    // Handle development sessions
    if (sessionToken.startsWith('dev-session-token-')) {
      console.log('🚧 Development session - returning mock metadata');
      return res.json({
        version: 0,
        lastModified: Date.now(),
        lastDevice: 'Development',
        taskCount: 0
      });
    }

    // Find user by session token
    const userKeys = await redis.keys('sn:u:*');

    let user = null;
    let userKey = null;

    for (const key of userKeys) {
      // Skip legacy sync keys
      if (key.includes(':sync:')) continue;

      const userData = await redis.hgetall(key);
      if (userData.session_token === sessionToken) {
        user = userData;
        userKey = key;
        break;
      }
    }

    if (!user) {
      return res.status(403).json({ error: 'Invalid session token' });
    }

    // Return minimal metadata for version checking
    const metadata = {
      version: parseInt(user.version || '0'),
      lastModified: parseInt(user.last_modified || user.last_active || '0'),
      lastDevice: user.last_device || 'Unknown'
    };

    // Optional: include task count for UI hints
    if (user.app_data) {
      try {
        const appData = typeof user.app_data === 'string' ?
          JSON.parse(user.app_data) : user.app_data;
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