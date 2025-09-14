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

  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email required - no legacy hash support' });
    }

    // Get premium user data directly by email
    const userData = await redis.hgetall(`sn:u:${email}`);

    if (!userData || !userData.email) {
      return res.status(404).json({ error: 'No premium user found for this email' });
    }

    // Parse app data
    const appData = userData.app_data ? JSON.parse(userData.app_data) : {};

    // Return admin-friendly summary
    const response = {
      email: userData.email,
      found: true,
      userData: {
        firstName: userData.first_name || '',
        tier: userData.tier || 'early_adopter',
        paymentType: userData.payment_type || 'lifetime',
        lastActive: userData.last_active ? new Date(parseInt(userData.last_active)).toISOString() : null,
        taskCount: appData.tasks?.length || 0,
        hasAchievements: appData.badges?.length > 0 || false,
        syncedFromLocal: userData.synced_from_local || null,
        hasSessionToken: !!userData.session_token,
        premiumStatus: 'active'
      }
    };

    console.log('🔍 Admin lookup for email:', email, {
      found: true,
      taskCount: response.userData?.taskCount || 0,
      tier: userData.tier
    });

    return res.json(response);

  } catch (error) {
    console.error('❌ Admin lookup error:', error);
    return res.status(500).json({ error: 'Failed to lookup user data' });
  }
}