import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  // Create Redis client exactly like tasks.js does
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
  });

  try {
    // Test 1: Direct key access
    const directData = await redis.hgetall('sn:u:thomas.seiger@gmail.com');

    // Test 2: Keys + loop (like tasks.js does)
    const allKeys = await redis.keys('sn:u:*');
    const userKeys = allKeys.filter(k => !k.includes(':sessions'));

    let loopData = null;
    for (const key of userKeys) {
      const userData = await redis.hgetall(key);
      if (userData.email === 'thomas.seiger@gmail.com') {
        loopData = userData;
        break;
      }
    }

    // Test 3: Direct REST API call
    const restResponse = await fetch(
      `${process.env.KV_REST_API_URL}/hgetall/sn:u:thomas.seiger@gmail.com`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`
        }
      }
    );
    const restData = await restResponse.json();

    return res.json({
      timestamp: new Date().toISOString(),
      vercel: {
        env: process.env.VERCEL_ENV || 'local',
        commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
        region: process.env.VERCEL_REGION || 'unknown'
      },
      redis: {
        url: process.env.KV_REST_API_URL?.substring(0, 40) + '...',
        tokenPrefix: process.env.KV_REST_API_TOKEN?.substring(0, 20) + '...'
      },
      tests: {
        directAccess: {
          version: directData?.version,
          tasks: directData?.app_data?.tasks?.length || 0,
          email: directData?.email
        },
        loopAccess: {
          version: loopData?.version,
          tasks: loopData?.app_data?.tasks?.length || 0,
          email: loopData?.email,
          keysFound: userKeys.length
        },
        restApi: {
          status: restResponse.status,
          hasResult: !!restData.result,
          resultLength: restData.result?.length || 0
        }
      },
      diagnosis: {
        directMatchesRest: directData?.version === '12362',
        loopMatchesDirect: loopData?.version === directData?.version,
        expectedVersion: '12362',
        expectedTasks: 277,
        actualDirectVersion: directData?.version,
        actualLoopVersion: loopData?.version
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
