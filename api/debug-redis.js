import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('🔬 Redis Debug Endpoint Called');

  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  try {
    // Test 1: What does hset actually store?
    const testKey1 = 'sn:debug:test1';
    const testData1 = { tasks: ['task1', 'task2'], count: 2 };
    const jsonString1 = JSON.stringify(testData1);

    console.log('📝 Test 1: Writing JSON string to Redis');
    console.log('  Input type:', typeof jsonString1);
    console.log('  Input value:', jsonString1);

    await redis.hset(testKey1, {
      data: jsonString1,
      type: 'json_string',
      timestamp: Date.now().toString()
    });

    const readBack1 = await redis.hgetall(testKey1);
    console.log('  Read back type:', typeof readBack1.data);
    console.log('  Read back value:', readBack1.data);

    results.tests.push({
      name: 'JSON String Storage',
      input: {
        type: typeof jsonString1,
        value: jsonString1,
        length: jsonString1.length
      },
      output: {
        type: typeof readBack1.data,
        value: readBack1.data,
        isObject: typeof readBack1.data === 'object',
        isString: typeof readBack1.data === 'string'
      },
      success: typeof readBack1.data === 'string'
    });

    // Test 2: What happens with direct object?
    const testKey2 = 'sn:debug:test2';

    console.log('📝 Test 2: Writing object directly to Redis');

    await redis.hset(testKey2, {
      data: testData1, // Direct object, not stringified
      type: 'direct_object',
      timestamp: Date.now().toString()
    });

    const readBack2 = await redis.hgetall(testKey2);
    console.log('  Read back type:', typeof readBack2.data);
    console.log('  Read back value:', readBack2.data);

    results.tests.push({
      name: 'Direct Object Storage',
      input: {
        type: typeof testData1,
        value: testData1
      },
      output: {
        type: typeof readBack2.data,
        value: readBack2.data,
        isObject: typeof readBack2.data === 'object',
        isString: typeof readBack2.data === 'string'
      }
    });

    // Test 3: Check actual user data
    const userKey = 'sn:u:test3@leodin.com';
    console.log('📝 Test 3: Checking actual user data');

    const userData = await redis.hgetall(userKey);
    if (userData && userData.app_data !== undefined) {
      console.log('  app_data type:', typeof userData.app_data);
      console.log('  app_data sample:', typeof userData.app_data === 'string'
        ? userData.app_data.substring(0, 100)
        : JSON.stringify(userData.app_data).substring(0, 100));

      results.tests.push({
        name: 'Actual User Data Check',
        userKey: userKey,
        appDataType: typeof userData.app_data,
        isObject: typeof userData.app_data === 'object',
        isString: typeof userData.app_data === 'string',
        canParse: false,
        parseError: null
      });

      // Try to parse if it's a string
      if (typeof userData.app_data === 'string') {
        try {
          const parsed = JSON.parse(userData.app_data);
          results.tests[results.tests.length - 1].canParse = true;
          results.tests[results.tests.length - 1].parsedType = typeof parsed;
        } catch (e) {
          results.tests[results.tests.length - 1].parseError = e.message;
        }
      }
    } else {
      results.tests.push({
        name: 'Actual User Data Check',
        error: 'No user data found or no app_data field'
      });
    }

    // Test 4: Test double stringification
    const testKey4 = 'sn:debug:test4';
    const doubleStringified = JSON.stringify(jsonString1);

    console.log('📝 Test 4: Double stringification test');
    console.log('  Input:', doubleStringified);

    await redis.hset(testKey4, {
      data: doubleStringified,
      type: 'double_stringified'
    });

    const readBack4 = await redis.hgetall(testKey4);
    console.log('  Read back:', readBack4.data);

    results.tests.push({
      name: 'Double Stringification',
      input: doubleStringified.substring(0, 50),
      outputType: typeof readBack4.data,
      outputValue: typeof readBack4.data === 'string' ? readBack4.data.substring(0, 50) : readBack4.data
    });

    // Test 5: Test with a simple string
    const testKey5 = 'sn:debug:test5';
    const simpleString = 'This is a simple string';

    console.log('📝 Test 5: Simple string storage');

    await redis.hset(testKey5, {
      data: simpleString,
      type: 'simple_string'
    });

    const readBack5 = await redis.hgetall(testKey5);

    results.tests.push({
      name: 'Simple String Storage',
      input: simpleString,
      inputType: typeof simpleString,
      outputType: typeof readBack5.data,
      outputValue: readBack5.data,
      match: simpleString === readBack5.data
    });

    // Cleanup test keys
    await redis.del(testKey1, testKey2, testKey4, testKey5);

    // Summary
    results.summary = {
      redisVersion: 'Upstash Redis',
      conclusion: '',
      recommendations: []
    };

    // Analyze results
    const jsonStringTest = results.tests.find(t => t.name === 'JSON String Storage');
    if (jsonStringTest && jsonStringTest.output.isObject) {
      results.summary.conclusion = 'Upstash Redis is AUTO-PARSING JSON strings into objects';
      results.summary.recommendations.push('Handle both object and string types when reading');
      results.summary.recommendations.push('Do NOT use JSON.parse if data is already an object');
    } else if (jsonStringTest && jsonStringTest.output.isString) {
      results.summary.conclusion = 'Upstash Redis correctly stores JSON as strings';
      results.summary.recommendations.push('Check for data corruption in write operations');
      results.summary.recommendations.push('Verify all endpoints use JSON.stringify before writing');
    }

    console.log('🔬 Debug tests complete:', results);

    return res.status(200).json(results);

  } catch (error) {
    console.error('❌ Redis debug error:', error);
    results.error = {
      message: error.message,
      stack: error.stack
    };
    return res.status(500).json(results);
  }
}