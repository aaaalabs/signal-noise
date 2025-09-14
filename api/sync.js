import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('🔄 Sync endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle GET request - retrieve user data
  if (req.method === 'GET') {
    const { emailHash } = req.query;

    if (!emailHash) {
      return res.status(400).json({ error: 'Email hash required' });
    }

    try {
      const userData = await redis.get(`sn:u:sync:${emailHash}`);

      if (!userData) {
        return res.status(404).json({ error: 'No data found' });
      }

      console.log('✅ Data retrieved for hash:', emailHash.substring(0, 6) + '...');
      return res.json(userData);

    } catch (error) {
      console.error('❌ Sync retrieve error:', error);
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
  }

  // Handle POST request - store user data
  if (req.method === 'POST') {
    let body;

    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    const { emailHash, data, firstName, language, timestamp } = body;

    if (!emailHash) {
      return res.status(400).json({ error: 'Email hash required' });
    }

    try {
      const syncData = {
        data: data || {},
        firstName: firstName || '',
        language: language || 'en',
        timestamp: timestamp || Date.now(),
        lastSync: new Date().toISOString(),
        version: '1.0.0'
      };

      // Store in Redis with TTL of 1 year (31536000 seconds)
      await redis.setex(`sn:u:sync:${emailHash}`, 31536000, JSON.stringify(syncData));


      console.log('✅ Data synced for hash:', emailHash.substring(0, 6) + '...', {
        taskCount: data?.tasks?.length || 0,
        hasFirstName: !!firstName,
        language
      });

      return res.json({
        success: true,
        timestamp: syncData.timestamp,
        synced: syncData.lastSync
      });

    } catch (error) {
      console.error('❌ Sync store error:', error);
      return res.status(500).json({ error: 'Failed to sync data' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}