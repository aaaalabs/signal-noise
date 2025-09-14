import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  console.log('🧪 Magic Link Simulation Test');

  try {
    const testToken = 'test-token-' + Date.now();
    const testEmail = 'test@example.com';
    const testUserKey = `sn:u:${testEmail}`;

    // Step 1: Create a test user (simulate webhook)
    const testUserData = {
      email: testEmail,
      access_token: 'test-access-token',
      payment_type: 'lifetime',
      tier: 'early_adopter',
      status: 'active',
      created_at: Date.now().toString(),
      first_name: 'Test User',
      app_data: JSON.stringify({
        tasks: [],
        history: [],
        badges: [],
        patterns: {},
        settings: { targetRatio: 80, notifications: false }
      }),
      session_token: null
    };

    console.log('Creating test user:', testUserKey);
    await redis.hset(testUserKey, testUserData);

    // Step 2: Create magic token (simulate email sending)
    const magicKey = `sn:magic:${testToken}`;
    await redis.setex(magicKey, 900, testEmail); // 15 minutes

    // Step 3: First request (simulate clicking magic link)
    console.log('=== FIRST REQUEST (Fresh) ===');

    // Check for cached result first
    const cacheKey = `sn:magic:verified:${testToken}`;
    let cachedResult = await redis.get(cacheKey);
    console.log('Cache check:', { found: !!cachedResult, type: typeof cachedResult, value: cachedResult });

    // Get email from magic token
    const email = await redis.get(magicKey);
    console.log('Magic token lookup:', { email, found: !!email });

    // Get user data
    const userData = await redis.hgetall(testUserKey);
    console.log('User lookup:', { found: !!userData, status: userData?.status });

    // Generate session token
    const sessionToken = randomBytes(32).toString('hex');

    // Update user with session
    await redis.hset(testUserKey, {
      session_token: sessionToken,
      last_active: Date.now().toString(),
      login_count: '1'
    });

    // Create success response
    const successResponse = {
      success: true,
      session: {
        email: email,
        token: userData.access_token,
        sessionToken: sessionToken,
        created: Date.now(),
        lastActive: Date.now(),
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000),
        firstName: userData.first_name || '',
        tier: userData.tier || 'early_adopter'
      },
      message: 'Successfully authenticated'
    };

    // Cache the response
    console.log('Caching response:', typeof successResponse);
    await redis.setex(cacheKey, 10, JSON.stringify(successResponse));

    // Delete magic token
    await redis.del(magicKey);

    console.log('First request result:', successResponse);

    // Step 4: Second request within 10 seconds (simulate refresh)
    console.log('=== SECOND REQUEST (Cached) ===');

    cachedResult = await redis.get(cacheKey);
    console.log('Cache hit:', { found: !!cachedResult, type: typeof cachedResult, value: cachedResult });

    let secondResponse;
    if (cachedResult) {
      // This is what the current code does
      secondResponse = cachedResult;
      console.log('Current code would return:', { type: typeof secondResponse, value: secondResponse });
    }

    // Clean up test data
    await redis.del(testUserKey);
    await redis.del(cacheKey);

    return res.json({
      test: 'Magic Link Flow Simulation',
      timestamp: new Date().toISOString(),
      results: {
        userCreated: !!testUserData,
        magicTokenCreated: !!email,
        userFound: !!userData,
        sessionGenerated: !!sessionToken,
        firstRequest: {
          responseType: typeof successResponse,
          response: successResponse
        },
        cacheStorage: {
          stored: 'JSON.stringify(successResponse)',
          storageMethod: 'redis.setex()'
        },
        secondRequest: {
          cacheHit: !!cachedResult,
          cachedType: typeof cachedResult,
          cachedValue: cachedResult,
          currentCodeReturns: secondResponse
        }
      },
      analysis: {
        problem: cachedResult ? 'Cache returns object, should work fine' : 'No cache hit detected',
        frontendReceives: {
          fresh: 'JavaScript object (good)',
          cached: typeof cachedResult + ' (' + (typeof cachedResult === 'object' ? 'good' : 'bad') + ')'
        }
      }
    });

  } catch (error) {
    console.error('Test failed:', error);
    return res.status(500).json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
}