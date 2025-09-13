import { Redis } from '@upstash/redis';
import { getUser, verifyMagicToken } from './redis-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || !token.trim()) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify token and get associated email
    const userEmail = await verifyMagicToken(redis, token.trim());

    if (!userEmail) {
      return res.status(404).json({
        error: 'Invalid or expired token',
        message: 'This magic link has expired or been used already'
      });
    }

    // Get current user data to return to frontend
    const userData = await getUser(redis, userEmail);

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Premium account no longer exists'
      });
    }

    // Verify user still has active premium status
    if (userData.status !== 'active') {
      return res.status(403).json({
        error: 'Premium account is not active',
        status: userData.status || 'unknown',
        message: 'Your premium access has been suspended or expired'
      });
    }

    console.log(`Magic link verified for ${userEmail} (${userData.tier})`);

    // Return user data for frontend to restore localStorage
    return res.status(200).json({
      success: true,
      message: 'Premium access verified successfully',
      user: {
        email: userEmail,
        tier: userData.tier,
        firstName: userData.first_name || '',
        status: userData.status,
        paymentType: userData.payment_type || 'lifetime',
        purchaseDate: userData.created_at || userData.purchase_date,
        accessToken: userData.access_token
      }
    });

  } catch (error) {
    console.error('Magic link verification error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify magic link'
    });
  }
}