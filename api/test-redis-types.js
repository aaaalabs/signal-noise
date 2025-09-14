import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('🧪 Redis Type Testing Endpoint');

  const testData = {
    message: 'Test object',
    timestamp: Date.now(),
    nested: {
      value: 42,
      array: [1, 2, 3]
    }
  };

  try {
    // Test 1: setex/get behavior
    const simpleKey = 'sn:test:simple:' + Date.now();
    await redis.setex(simpleKey, 60, JSON.stringify(testData));
    const simpleResult = await redis.get(simpleKey);

    // Test 2: hset/hgetall behavior
    const hashKey = 'sn:test:hash:' + Date.now();
    await redis.hset(hashKey, {
      data: JSON.stringify(testData),
      raw_string: 'plain text',
      number_field: '42'
    });
    const hashResult = await redis.hgetall(hashKey);

    // Test 3: Check what happens with cached magic link data
    const cacheKey = 'sn:magic:verified:test-' + Date.now();
    const mockSession = {
      success: true,
      session: {
        email: 'test@example.com',
        token: 'test-token',
        created: Date.now()
      }
    };
    await redis.setex(cacheKey, 60, JSON.stringify(mockSession));
    const cacheResult = await redis.get(cacheKey);

    // Clean up test keys
    await redis.del(simpleKey);
    await redis.del(hashKey);
    await redis.del(cacheKey);

    // Return analysis
    return res.json({
      test: 'Redis Type Behavior',
      timestamp: new Date().toISOString(),
      results: {
        simpleKey: {
          stored: 'JSON.stringify(object)',
          retrievedType: typeof simpleResult,
          retrievedValue: simpleResult,
          needsParsing: typeof simpleResult === 'string',
          parsed: typeof simpleResult === 'string' ? JSON.parse(simpleResult) : simpleResult
        },
        hashKey: {
          stored: 'JSON.stringify in data field',
          dataFieldType: typeof hashResult?.data,
          dataFieldValue: hashResult?.data,
          rawStringType: typeof hashResult?.raw_string,
          numberFieldType: typeof hashResult?.number_field,
          fullResult: hashResult
        },
        cacheKey: {
          stored: 'JSON.stringify(session)',
          retrievedType: typeof cacheResult,
          retrievedValue: cacheResult,
          needsParsing: typeof cacheResult === 'string',
          whatFrontendExpects: 'JavaScript object for res.json()'
        }
      },
      conclusion: {
        setexReturns: typeof simpleResult,
        hgetallDataField: typeof hashResult?.data,
        problem: 'If we pass string directly to res.json(), it gets double-encoded',
        solution: 'Parse strings from redis.get() before passing to res.json()'
      }
    });

  } catch (error) {
    console.error('Test failed:', error);
    return res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
}