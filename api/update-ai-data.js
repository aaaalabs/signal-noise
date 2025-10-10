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
    const { email, aiData } = req.body;

    if (!email || !aiData) {
      return res.status(400).json({ error: 'Missing email or aiData' });
    }

    const userKey = `sn:u:${email}`;

    // Verify user exists
    const userData = await redis.hgetall(userKey);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Save AI data to separate field
    await redis.hset(userKey, {
      app_ai_data: JSON.stringify(aiData)
    });

    console.log('✅ AI data updated for:', email, aiData);

    return res.status(200).json({
      success: true,
      message: 'AI data updated successfully',
      aiData
    });

  } catch (error) {
    console.error('Update AI data error:', error);
    return res.status(500).json({ error: error.message });
  }
}
