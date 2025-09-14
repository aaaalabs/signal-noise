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
    console.log('🔧 Restoring test data for test3@leodin.com...');

    const userKey = 'sn:u:test3@leodin.com';

    // Restore the 3 test tasks that were lost
    const restoredAppData = {
      tasks: [
        {
          id: Date.now() - 120000, // 2 minutes ago
          text: "Review daily tasks",
          type: "signal",
          timestamp: new Date(Date.now() - 120000).toISOString(),
          completed: false
        },
        {
          id: Date.now() - 90000, // 1.5 minutes ago
          text: "Check social media",
          type: "noise",
          timestamp: new Date(Date.now() - 90000).toISOString(),
          completed: false
        },
        {
          id: Date.now() - 60000, // 1 minute ago
          text: "Work on project",
          type: "signal",
          timestamp: new Date(Date.now() - 60000).toISOString(),
          completed: false
        }
      ],
      history: [],
      badges: [],
      patterns: {},
      settings: {
        targetRatio: 80,
        notifications: false,
        firstName: "Tom"
      }
    };

    // Update user data in Redis
    await redis.hset(userKey, {
      app_data: JSON.stringify(restoredAppData),
      last_active: Date.now().toString(),
      data_restored: new Date().toISOString()
    });

    console.log('✅ Test data restored successfully for test3@leodin.com');

    return res.json({
      success: true,
      message: 'Test data restored successfully',
      user: 'test3@leodin.com',
      tasks: restoredAppData.tasks.length,
      restored: restoredAppData.tasks
    });

  } catch (error) {
    console.error('❌ Restore error:', error);
    return res.status(500).json({ error: 'Restore failed' });
  }
}