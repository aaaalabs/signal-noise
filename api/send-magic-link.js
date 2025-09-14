import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import { getUser, createMagicToken } from './redis-helper.js';
import { sendMagicLink } from './email-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const userEmail = email.trim().toLowerCase();

  try {
    // Check if user exists and has premium access
    const userData = await getUser(redis, userEmail);

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(404).json({
        error: 'No premium account found for this email address',
        suggestion: 'Please check your email address or purchase premium access'
      });
    }

    // Verify user has active premium status
    if (userData.status !== 'active') {
      return res.status(403).json({
        error: 'Premium account is not active',
        status: userData.status || 'unknown'
      });
    }

    // Generate secure magic token
    const token = randomBytes(32).toString('hex');

    // Store token in Redis with 15-minute expiry
    await createMagicToken(redis, userEmail, token, 15);

    // Build verification URL
    // Priority: Custom domain > Vercel URL > Local development
    let baseUrl;
    if (process.env.VERCEL_ENV === 'production') {
      baseUrl = 'https://signal-noise.app';
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.PORT) {
      baseUrl = `http://localhost:${process.env.PORT}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }

    const verifyUrl = `${baseUrl}/verify?token=${token}`;

    // Determine tier name for email
    const tierName = userData.tier === 'foundation'
      ? 'Foundation Member'
      : 'Early Adopter';

    // Send magic link email
    const emailResult = await sendMagicLink(userEmail, verifyUrl, tierName);

    if (!emailResult.success) {
      console.error('Failed to send magic link email:', emailResult.error);
      return res.status(500).json({
        error: 'Failed to send recovery email',
        details: emailResult.error
      });
    }

    console.log(`Magic link sent to ${userEmail} (${tierName})`);

    return res.status(200).json({
      success: true,
      message: 'Recovery email sent successfully',
      tier: userData.tier,
      messageId: emailResult.messageId
    });

  } catch (error) {
    console.error('Magic link error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process recovery request'
    });
  }
}