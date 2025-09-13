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
    const key = `sn:u:${email}`;

    // First, check what type of data is stored
    console.log('🔍 Checking key type for:', key);

    // Data is stored as a Redis hash, use hgetall to retrieve
    const userData = await redis.hgetall(key);
    console.log('✅ Retrieved user data as hash:', userData);

    // Check if userData exists and has data (hgetall returns {} if no data)
    if (!userData || Object.keys(userData).length === 0) {
      console.log('❌ No userData found for:', email);
      return res.json({ isActive: false });
    }

    // Debug: Log what we found
    console.log('🔍 Raw userData from KV:', JSON.stringify(userData, null, 2));
    console.log('🔍 userData.status:', userData.status);
    console.log('🔍 userData.payment_type:', userData.payment_type);

    // Check if payment is valid (either 'active' or 'lifetime')
    const isActive = userData.status === 'active' || userData.payment_type === 'lifetime';

    console.log('✅ Premium status check for:', email, '- Active:', isActive);

    return res.json({
      isActive,
      email: userData.email,
      subscriptionId: userData.access_token,
      paymentType: userData.payment_type,
      activatedAt: userData.created_at ? new Date(parseInt(userData.created_at)).toISOString() : null,
      debug: {
        rawUserData: userData,
        statusCheck: userData.status === 'active',
        paymentTypeCheck: userData.payment_type === 'lifetime'
      }
    });

  } catch (error) {
    console.error('❌ Premium status check error:', error);
    return res.status(500).json({ error: 'Failed to check premium status' });
  }
}