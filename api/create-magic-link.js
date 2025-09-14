import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔗 Creating fresh magic link');

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Check if user exists
    const userKey = `sn:u:${email}`;
    const user = await redis.hgetall(userKey);

    if (!user || !user.email) {
      return res.status(404).json({
        error: 'User not found',
        availableUsers: ['test1@leodin.com', 'test3@leodin.com']
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User is not active', status: user.status });
    }

    // Generate fresh magic token
    const magicToken = randomBytes(32).toString('hex');
    const magicKey = `sn:magic:${magicToken}`;

    // Store magic token (expires in 15 minutes)
    await redis.setex(magicKey, 900, email);

    console.log('✅ Magic link created:', {
      email,
      token: magicToken.substring(0, 8) + '...',
      expires: '15 minutes'
    });

    return res.json({
      success: true,
      email: email,
      magicToken: magicToken,
      magicLink: `https://signal-noise-omcq7wnns-thomas-projects-2f71c075.vercel.app/verify?token=${magicToken}`,
      verifyApiUrl: `https://signal-noise-omcq7wnns-thomas-projects-2f71c075.vercel.app/api/auth/verify-magic-link?token=${magicToken}`,
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      userInfo: {
        firstName: user.first_name,
        tier: user.tier,
        hasAppData: !!user.app_data
      },
      instructions: [
        '1. Click the magicLink URL to test frontend integration',
        '2. Or curl the verifyApiUrl to test API directly',
        '3. Magic link expires in 15 minutes',
        '4. Can be used multiple times within 10-second cache window'
      ]
    });

  } catch (error) {
    console.error('❌ Magic link creation failed:', error);
    return res.status(500).json({
      error: 'Failed to create magic link',
      message: error.message
    });
  }
}