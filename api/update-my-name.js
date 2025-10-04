import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ error: 'Missing email or firstName' });
    }

    const userKey = `sn:u:${email}`;

    // Get current app_data
    const userData = await redis.hgetall(userKey);

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    let appData = {};
    if (userData.app_data) {
      try {
        appData = JSON.parse(userData.app_data);
      } catch (e) {
        console.error('Error parsing existing app_data:', e);
      }
    }

    // Update firstName in settings
    if (!appData.settings) {
      appData.settings = {};
    }
    appData.settings.firstName = firstName;

    // Save back to Redis
    await redis.hset(userKey, {
      app_data: JSON.stringify(appData)
    });

    return res.status(200).json({
      success: true,
      message: `Name updated to ${firstName}`,
      email,
      firstName
    });

  } catch (error) {
    console.error('Update name error:', error);
    return res.status(500).json({ error: error.message });
  }
}
