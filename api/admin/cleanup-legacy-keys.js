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
    console.log('🧹 Starting legacy key cleanup...');

    // Find all legacy sync keys
    const allKeys = await redis.keys('sn:u:*');
    const legacyKeys = allKeys.filter(key => key.includes(':sync:'));

    console.log(`Found ${legacyKeys.length} legacy sync keys:`, legacyKeys);

    if (legacyKeys.length === 0) {
      return res.json({
        success: true,
        message: 'No legacy keys found to cleanup',
        deleted: 0
      });
    }

    // Delete legacy keys
    const deletePromises = legacyKeys.map(key => redis.del(key));
    await Promise.all(deletePromises);

    console.log(`✅ Deleted ${legacyKeys.length} legacy sync keys`);

    return res.json({
      success: true,
      message: `Successfully deleted ${legacyKeys.length} legacy sync keys`,
      deleted: legacyKeys.length,
      keys: legacyKeys
    });

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return res.status(500).json({ error: 'Cleanup failed' });
  }
}