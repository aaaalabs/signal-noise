import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  // Enable CORS for widget access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    // Initialize Redis client
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // Get user data from Redis
    const userData = await redis.hgetall(`sn:u:${email}`);

    if (!userData || !userData.email) {
      // Return demo data for widget testing
      return res.status(200).json({
        ratio: 83,
        signalCount: 5,
        noiseCount: 1,
        streak: 3,
        lastUpdate: new Date().toISOString(),
        tier: 'demo',
        badges: ['early_bird'],
        firstName: 'Demo',
        dataSource: 'DEMO'
      });
    }

    // Parse app_data which contains the actual Signal/Noise data
    let appData = {};
    if (userData.app_data) {
      // Upstash returns app_data as object directly
      appData = typeof userData.app_data === 'string'
        ? JSON.parse(userData.app_data)
        : userData.app_data;
    }

    // Calculate ratio from tasks in app_data
    let ratio = 50; // Default to 50%
    let signalCount = 0;
    let noiseCount = 0;

    if (appData.tasks && Array.isArray(appData.tasks)) {
      // Get today's tasks only
      const today = new Date().toDateString();
      const todayTasks = appData.tasks.filter(task =>
        new Date(task.timestamp).toDateString() === today
      );

      signalCount = todayTasks.filter(t => t.type === 'signal').length;
      noiseCount = todayTasks.filter(t => t.type === 'noise').length;
      const total = signalCount + noiseCount;

      if (total > 0) {
        ratio = Math.round((signalCount / total) * 100);
      }
    }

    // Calculate streak from history
    let streak = 0;
    if (appData.history && Array.isArray(appData.history)) {
      // Count consecutive days with good ratio (>= target)
      const targetRatio = appData.settings?.targetRatio || 80;
      for (let i = appData.history.length - 1; i >= 0; i--) {
        if (appData.history[i].ratio >= targetRatio) {
          streak++;
        } else {
          break;
        }
      }
    }

    // Return widget-optimized data
    return res.status(200).json({
      ratio,
      signalCount,
      noiseCount,
      streak,
      lastUpdate: userData.last_active || new Date().toISOString(),
      tier: userData.tier || 'free',
      badges: appData.badges || [],
      firstName: userData.first_name || ''
    });

  } catch (error) {
    console.error('Widget data fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch widget data',
      message: error.message
    });
  }
}