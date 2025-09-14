import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic auth check for admin access
  const authHeader = req.headers.authorization;
  const expectedAuth = process.env.ADMIN_AUTH_TOKEN;

  if (!authHeader || !expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { emailHash, email } = req.query;

  try {
    let targetEmailHash = emailHash;

    // If email provided instead of hash, convert it
    if (email && !emailHash) {
      targetEmailHash = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
    }

    if (!targetEmailHash) {
      return res.status(400).json({ error: 'Email hash or email required' });
    }

    // Get user data
    const userData = await redis.get(`sn:u:sync:${targetEmailHash}`);

    if (!userData) {
      return res.status(404).json({ error: 'No data found for this user' });
    }

    // Return admin-friendly summary
    const response = {
      emailHash: targetEmailHash,
      found: !!userData,
      userData: {
        firstName: userData.firstName || '',
        language: userData.language || 'en',
        lastSync: userData.lastSync || null,
        taskCount: userData.data?.tasks?.length || 0,
        hasAchievements: userData.data?.badges?.length > 0 || false,
        version: userData.version || 'unknown',
        lastActive: userData.lastSync || null,
        premiumStatus: 'active'
      }
    };

    console.log('🔍 Admin lookup for hash:', targetEmailHash.substring(0, 6) + '...', {
      found: !!userData,
      taskCount: response.userData?.taskCount || 0
    });

    return res.json(response);

  } catch (error) {
    console.error('❌ Admin lookup error:', error);
    return res.status(500).json({ error: 'Failed to lookup user data' });
  }
}