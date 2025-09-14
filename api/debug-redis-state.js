import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('🔍 Redis State Debug');

  try {
    // Check for magic tokens
    const magicKeys = await redis.keys('sn:magic:*');
    console.log('Magic keys found:', magicKeys.length);

    // Check for users
    const userKeys = await redis.keys('sn:u:*');
    console.log('User keys found:', userKeys.length);

    // Check for cached verifications
    const cacheKeys = await redis.keys('sn:magic:verified:*');
    console.log('Cache keys found:', cacheKeys.length);

    // Sample user data
    let sampleUser = null;
    if (userKeys.length > 0) {
      const firstUserKey = userKeys[0];
      sampleUser = await redis.hgetall(firstUserKey);
      console.log('Sample user data:', {
        key: firstUserKey,
        hasSessionToken: !!sampleUser?.session_token,
        status: sampleUser?.status,
        tier: sampleUser?.tier,
        appDataType: typeof sampleUser?.app_data
      });
    }

    // Sample magic token (if any exist)
    let sampleMagicToken = null;
    if (magicKeys.length > 0) {
      const firstMagicKey = magicKeys[0];
      sampleMagicToken = await redis.get(firstMagicKey);
      console.log('Sample magic token:', {
        key: firstMagicKey,
        pointsToEmail: sampleMagicToken
      });
    }

    return res.json({
      timestamp: new Date().toISOString(),
      redis: {
        magicTokens: {
          count: magicKeys.length,
          keys: magicKeys.slice(0, 5), // First 5 only
          sample: sampleMagicToken ? {
            key: magicKeys[0],
            email: sampleMagicToken
          } : null
        },
        users: {
          count: userKeys.length,
          keys: userKeys.slice(0, 5), // First 5 only
          sample: sampleUser ? {
            key: userKeys[0],
            email: sampleUser.email,
            status: sampleUser.status,
            tier: sampleUser.tier,
            hasSessionToken: !!sampleUser.session_token,
            hasAppData: !!sampleUser.app_data,
            appDataType: typeof sampleUser.app_data,
            firstName: sampleUser.first_name
          } : null
        },
        cachedVerifications: {
          count: cacheKeys.length,
          keys: cacheKeys
        }
      },
      analysis: {
        hasMagicTokens: magicKeys.length > 0,
        hasUsers: userKeys.length > 0,
        hasActiveCache: cacheKeys.length > 0,
        possibleIssue: magicKeys.length === 0 ? 'No magic tokens - they may have expired' :
                       userKeys.length === 0 ? 'No users in database' :
                       'Data exists, issue might be elsewhere'
      }
    });

  } catch (error) {
    console.error('Redis debug failed:', error);
    return res.status(500).json({
      error: 'Redis debug failed',
      message: error.message
    });
  }
}