import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    // Check if user exists in KV store
    const userData = await redis.hgetall(`sn:u:${email}`);

    // If no user or empty object
    if (!userData || Object.keys(userData).length === 0) {
      return res.json({ isPremium: false });
    }

    // Check if user has active premium
    const isActive = userData.status === 'active' || userData.payment_type === 'lifetime';

    if (isActive) {
      return res.json({
        isPremium: true,
        email: userData.email,
        firstName: userData.first_name || '',
        paymentType: userData.payment_type,
        activatedAt: userData.created_at ? new Date(parseInt(userData.created_at)).toISOString() : null
      });
    } else {
      return res.json({ isPremium: false });
    }

  } catch (error) {
    console.error('Activate premium error:', error);
    return res.status(500).json({ error: 'Activation failed' });
  }
}