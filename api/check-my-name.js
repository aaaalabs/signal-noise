import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  try {
    const email = 'thomas.seiger@gmail.com';
    const userKey = `sn:u:${email}`;

    // Get user data
    const userData = await redis.hgetall(userKey);

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Parse app_data if it exists
    let appData = null;
    if (userData.app_data) {
      try {
        appData = JSON.parse(userData.app_data);
      } catch (e) {
        appData = { error: 'Could not parse app_data', raw: userData.app_data };
      }
    }

    return res.status(200).json({
      email,
      firstName: appData?.settings?.firstName || 'NOT SET',
      redisData: {
        status: userData.status,
        payment_type: userData.payment_type,
        hasAppData: !!userData.app_data
      },
      settings: appData?.settings || null
    });

  } catch (error) {
    console.error('Check name error:', error);
    return res.status(500).json({ error: error.message });
  }
}
