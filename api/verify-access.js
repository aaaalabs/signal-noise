import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, accessToken } = req.body;

    if (!email || !accessToken) {
      return res.status(400).json({
        error: 'Email and access token required'
      });
    }

    // Get user data
    const userKey = `user:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || !userData.access_token) {
      return res.status(404).json({
        error: 'User not found or no premium access'
      });
    }

    // Verify access token
    if (userData.access_token !== accessToken) {
      return res.status(401).json({
        error: 'Invalid access token'
      });
    }

    // Check if access is still valid
    const now = Date.now();
    const expiresAt = parseInt(userData.expires_at || '0');

    let isValid = false;
    let expiryInfo = null;

    if (userData.payment_type === 'lifetime') {
      isValid = userData.status === 'active';
      expiryInfo = null; // Never expires
    } else {
      // Subscription - check expiry and status
      isValid = userData.status === 'active' && (expiresAt === 0 || expiresAt > now);
      expiryInfo = expiresAt > 0 ? new Date(expiresAt).toISOString() : null;
    }

    if (!isValid) {
      let reason = 'Unknown';
      if (userData.status !== 'active') {
        reason = `Status: ${userData.status}`;
      } else if (expiresAt > 0 && expiresAt <= now) {
        reason = 'Subscription expired';
      }

      return res.status(403).json({
        error: 'Premium access not valid',
        reason: reason,
        status: userData.status,
        expiresAt: expiryInfo
      });
    }

    // Update last access time
    await redis.hset(userKey, {
      last_access: now.toString()
    });

    // Get usage stats for today
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `usage:${email}:${today}`;
    const todayUsage = await redis.get(usageKey) || '0';

    return res.status(200).json({
      valid: true,
      email: userData.email,
      firstName: userData.first_name || '',
      paymentType: userData.payment_type,
      status: userData.status,
      expiresAt: expiryInfo,
      createdAt: userData.created_at ? new Date(parseInt(userData.created_at)).toISOString() : null,
      lastAccess: userData.last_access ? new Date(parseInt(userData.last_access)).toISOString() : null,
      todayUsage: parseInt(todayUsage),
      limits: {
        requestsPerHour: 10,
        maxTokensPerRequest: 300
      }
    });

  } catch (error) {
    console.error('Access verification error:', error);
    return res.status(500).json({
      error: 'Verification failed'
    });
  }
}