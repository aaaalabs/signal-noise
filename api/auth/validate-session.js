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

    const accessToken = authHeader.substring(7);

    console.log('🔍 Validating access token:', accessToken.substring(0, 8) + '...');

    // Handle development sessions
    if (accessToken.startsWith('dev-session-token-')) {
      console.log('🚧 Development session validation');
      return res.status(200).json({
        valid: true,
        user: {
          email: 'dev@signal-noise.test',
          firstName: 'Dev User',
          tier: 'early_adopter',
          paymentType: 'lifetime',
          lastActive: Date.now(),
          expires: Date.now() + (365 * 24 * 60 * 60 * 1000),
          syncedFromLocal: null
        }
      });
    }

    // Simple token validation: find user with matching access_token
    const userKeys = await redis.keys('sn:u:*');
    let user = null;

    for (const userKey of userKeys) {
      if (userKey.includes(':sessions')) continue; // Skip session lists

      const userData = await redis.hgetall(userKey);
      if (userData.access_token === accessToken && userData.status === 'active') {
        user = userData;

        // Update last active
        await redis.hset(userKey, {
          last_active: Date.now().toString()
        });

        break;
      }
    }

    if (!user) {
      console.log('❌ Invalid access token');
      return res.status(404).json({
        error: 'Invalid access token',
        valid: false
      });
    }

    console.log('✅ Access token validated for:', user.email);

    // Return validation result
    return res.status(200).json({
      valid: true,
      user: {
        email: user.email,
        firstName: user.first_name || '',
        tier: user.tier || 'early_adopter',
        paymentType: user.payment_type || 'lifetime',
        lastActive: Date.now(),
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000), // Effectively permanent
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