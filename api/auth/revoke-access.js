import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const accessToken = authHeader.substring(7);

  try {
    console.log('🚪 Global access revocation requested:', accessToken.substring(0, 8) + '...');

    // Handle development sessions
    if (accessToken.startsWith('dev-session-token-')) {
      console.log('🚧 Development session - simulating token revocation');
      return res.json({
        success: true,
        message: 'Development session revoked (localStorage only)',
        revokedDevices: 1
      });
    }

    // Find user by access token
    const userKeys = await redis.keys('sn:u:*');
    let user = null;
    let userKey = null;

    for (const key of userKeys) {
      if (key.includes(':sessions')) continue; // Skip session lists

      const userData = await redis.hgetall(key);
      if (userData.access_token === accessToken && userData.status === 'active') {
        user = userData;
        userKey = key;
        break;
      }
    }

    if (!user) {
      return res.status(403).json({ error: 'Invalid access token' });
    }

    console.log('🔍 Revoking access for user:', user.email);

    // KISS: Simply delete the access_token field
    await redis.hdel(userKey, 'access_token');

    // Update last activity with revocation timestamp
    await redis.hset(userKey, {
      last_active: Date.now().toString(),
      access_revoked: Date.now().toString()
    });

    console.log('✅ Access token revoked globally for user:', user.email);

    return res.json({
      success: true,
      message: 'Access revoked on all devices',
      email: user.email,
      revokedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Token revocation error:', error);
    return res.status(500).json({
      error: 'Failed to revoke access'
    });
  }
}