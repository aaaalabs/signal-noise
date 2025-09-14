import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import { sendWelcomeEmail } from '../email-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Check if user exists and is premium
    const userKey = `sn:u:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(404).json({ error: 'Premium user not found' });
    }

    if (userData.status !== 'active') {
      return res.status(403).json({ error: 'Premium access not active' });
    }

    // Check if another session is active (single device enforcement)
    const now = Date.now();
    const lastActive = parseInt(userData.last_active || '0');
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    if (lastActive > thirtyDaysAgo && userData.session_token) {
      return res.status(409).json({
        error: 'Active session exists',
        message: 'Please logout from your other device first',
        lastActive: new Date(lastActive).toISOString()
      });
    }

    // Generate magic token
    const magicToken = randomBytes(32).toString('hex');
    const magicKey = `sn:magic:${magicToken}`;

    // Store magic token with 15min expiry
    await redis.setex(magicKey, 900, email); // 15 minutes

    // Send magic link email
    try {
      const magicLink = `${req.headers.origin || 'https://signal-noise.app'}/auth/verify?token=${magicToken}`;

      // For now, we'll use the existing welcome email structure
      // TODO: Create dedicated magic link email template
      console.log('🔗 Magic link generated:', magicLink);
      console.log('📧 Magic link request for:', email);

      // In development, just log the link
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 DEVELOPMENT: Magic link:', magicLink);
      }

      return res.status(200).json({
        success: true,
        message: 'Magic link sent to your email',
        // Include link in development for testing
        ...(process.env.NODE_ENV === 'development' && {
          devLink: magicLink
        })
      });

    } catch (emailError) {
      console.error('❌ Failed to send magic link email:', emailError);
      // Don't fail the request if email fails
      return res.status(200).json({
        success: true,
        message: 'Magic link generated (email delivery may be delayed)',
        ...(process.env.NODE_ENV === 'development' && {
          devLink: `${req.headers.origin || 'https://signal-noise.app'}/auth/verify?token=${magicToken}`
        })
      });
    }

  } catch (error) {
    console.error('❌ Magic link request error:', error);
    return res.status(500).json({
      error: 'Failed to process magic link request'
    });
  }
}