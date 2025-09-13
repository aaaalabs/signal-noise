import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token || !token.startsWith('ml_')) {
      return res.status(400).json({ error: 'Invalid magic link token' });
    }

    // Get email from magic link
    const magicLinkKey = `magic_link:${token}`;
    const email = await redis.get(magicLinkKey);

    if (!email) {
      return res.status(401).json({
        error: 'Magic link expired or invalid. Please request a new one.'
      });
    }

    // Delete used magic link
    await redis.del(magicLinkKey);

    // Get user data
    const userKey = `user:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || userData.status !== 'active') {
      return res.status(403).json({
        error: 'Premium access not active'
      });
    }

    // Generate new access token for this session
    const accessToken = 'snk_' + randomBytes(32).toString('hex');

    // Update user with new access token
    await redis.hset(userKey, {
      access_token: accessToken,
      last_login: Date.now().toString()
    });

    return res.status(200).json({
      email: userData.email,
      firstName: userData.first_name || '',
      accessToken: accessToken,
      paymentType: userData.payment_type,
      expiresAt: userData.expires_at === '0' ? null : parseInt(userData.expires_at),
      message: 'Successfully authenticated'
    });

  } catch (error) {
    console.error('Magic link verification error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}