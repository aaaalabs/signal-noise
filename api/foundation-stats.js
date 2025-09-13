import { Redis } from '@upstash/redis';
import { getFoundationCount } from './redis-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const foundationCount = await getFoundationCount(redis);
    const spotsLeft = Math.max(0, 100 - foundationCount);
    const isAvailable = spotsLeft > 0;

    return res.status(200).json({
      foundationMembers: foundationCount,
      spotsLeft: spotsLeft,
      totalSpots: 100,
      isAvailable: isAvailable,
      currentTier: isAvailable ? 'foundation' : 'early_adopter',
      currentPrice: isAvailable ? 29 : 49
    });

  } catch (error) {
    console.error('Foundation stats error:', error);
    return res.status(500).json({
      error: 'Failed to get Foundation stats'
    });
  }
}