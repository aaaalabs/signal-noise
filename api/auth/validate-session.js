import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessionToken = authHeader.substring(7);

    // Handle development sessions
    if (sessionToken.startsWith('dev-session-token-')) {
      console.log('🚧 Development session validation for:', sessionToken.substring(0, 20) + '...');
      return res.status(200).json({
        valid: true,
        user: {
          email: 'dev@signal-noise.test',
          firstName: 'Dev User',
          tier: 'early_adopter',
          paymentType: 'lifetime',
          lastActive: Date.now(),
          expires: Date.now() + (30 * 24 * 60 * 60 * 1000),
          syncedFromLocal: null
        }
      });
    }

    // Find user by session token in Redis
    const userKeys = await redis.keys('sn:u:*');
    let user = null;
    let userKey = null;

    for (const key of userKeys) {
      // Skip legacy sync keys - only check user data keys
      if (key.includes('sn:u:sync:')) continue;

      const userData = await redis.hgetall(key);
      if (userData.session_token === sessionToken) {
        user = userData;
        userKey = key;
        break;
      }
    }

    if (!user) {
      return res.status(404).json({
        error: 'Invalid session token',
        valid: false
      });
    }

    // Check session expiry (30 days)
    const now = Date.now();
    const lastActive = parseInt(user.last_active || '0');
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    if (lastActive < thirtyDaysAgo) {
      // Session expired, clean it up
      await redis.hdel(userKey, 'session_token');
      return res.status(401).json({
        error: 'Session expired',
        valid: false
      });
    }

    // Update last active timestamp
    await redis.hset(userKey, {
      last_active: now.toString()
    });

    // Return session validation result
    return res.status(200).json({
      valid: true,
      user: {
        email: user.email,
        firstName: user.first_name || '',
        tier: user.tier || 'early_adopter',
        paymentType: user.payment_type || 'lifetime',
        lastActive: now,
        expires: now + (30 * 24 * 60 * 60 * 1000), // 30 days from now
        syncedFromLocal: user.synced_from_local || null
      }
    });

  } catch (error) {
    console.error('❌ Session validation error:', error);
    return res.status(500).json({
      error: 'Failed to validate session',
      valid: false
    });
  }
}