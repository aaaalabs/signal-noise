import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    // Check if user exists in KV store (data stored as Redis hash)
    const userData = await redis.hgetall(`sn:u:${email}`);

    if (!userData || Object.keys(userData).length === 0) {
      return res.json({ isActive: false });
    }

    // Check if payment is valid (either 'active' status or 'lifetime' payment type)
    const isActive = userData.status === 'active' || userData.payment_type === 'lifetime';

    return res.json({
      isActive,
      email: userData.email,
      subscriptionId: userData.access_token,
      paymentType: userData.payment_type,
      tier: userData.tier || 'early_adopter', // Add tier for correct welcome message
      firstName: userData.first_name || '', // Add firstName for personalized greeting
      activatedAt: userData.created_at ? new Date(parseInt(userData.created_at)).toISOString() : null
    });

  } catch (error) {
    console.error('❌ Premium status check error:', error);
    return res.status(500).json({ error: 'Failed to check premium status' });
  }
}