import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const foundationCount = await redis.get('foundation_members_count') || 0;
    const spotsLeft = Math.max(0, 100 - parseInt(foundationCount));
    const isAvailable = spotsLeft > 0;

    return res.status(200).json({
      foundationMembers: parseInt(foundationCount),
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