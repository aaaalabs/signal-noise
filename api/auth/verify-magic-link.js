import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Magic link token required' });
    }

    // Check for cached verification result first (handles duplicate requests)
    const cacheKey = `sn:magic:verified:${token}`;
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      console.log('🔄 Returning cached magic link verification result');
      // Upstash returns objects directly, no parsing needed
      return res.status(200).json(cachedResult);
    }

    // Get email from magic token
    const magicKey = `sn:magic:${token}`;
    const email = await redis.get(magicKey);

    if (!email) {
      return res.status(404).json({
        error: 'Invalid or expired magic link',
        message: 'Magic links expire after 15 minutes. Please request a new one.'
      });
    }

    // Get user data
    const userKey = `sn:u:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userData.status !== 'active') {
      return res.status(403).json({ error: 'Premium access not active' });
    }

    // Generate new session token
    const sessionToken = randomBytes(32).toString('hex');
    const now = Date.now();

    // Update user session data
    await redis.hset(userKey, {
      session_token: sessionToken,
      last_active: now.toString(),
      login_count: (parseInt(userData.login_count || '0') + 1).toString()
    });

    // Prepare session data for frontend
    const sessionData = {
      email: email,
      token: userData.access_token, // Use the access token from webhook
      sessionToken: sessionToken,
      created: now,
      lastActive: now,
      expires: now + (30 * 24 * 60 * 60 * 1000), // 30 days
      firstName: userData.first_name || '',
      tier: userData.tier || 'early_adopter',
      paymentType: userData.payment_type || 'lifetime',
      syncedFromLocal: userData.synced_from_local || null
    };

    // Prepare success response
    const successResponse = {
      success: true,
      session: sessionData,
      message: 'Successfully authenticated'
    };

    // Cache the success response for 10 seconds (handles duplicate requests)
    await redis.setex(cacheKey, 10, JSON.stringify(successResponse));

    // Delete magic token (one-time use) - only after caching success
    await redis.del(magicKey);

    console.log('✅ Magic link verified successfully:', {
      email,
      tier: userData.tier,
      sessionToken: sessionToken.substring(0, 8) + '...'
    });

    return res.status(200).json(successResponse);

  } catch (error) {
    console.error('❌ Magic link verification error:', error);
    return res.status(500).json({
      error: 'Failed to verify magic link'
    });
  }
}