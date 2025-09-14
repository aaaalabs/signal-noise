// Test script for Upstash Redis Foundation member functionality
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';
import { keys, getFoundationCount, incrementFoundation, setUser, getUser } from './api/redis-helper.js';

// Load environment variables
config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function testFoundationStats() {
  console.log('🧪 Testing Foundation Stats...');

  try {
    // Get current Foundation member count
    const currentCount = await getFoundationCount(redis);
    console.log('Current Foundation members:', currentCount);

    // Test stats calculation
    const stats = {
      foundationMembers: currentCount,
      spotsLeft: Math.max(0, 100 - currentCount),
      totalSpots: 100,
      isAvailable: currentCount < 100,
      currentTier: currentCount < 100 ? 'foundation' : 'early_adopter',
      currentPrice: currentCount < 100 ? 29 : 49
    };

    console.log('Foundation Stats:', JSON.stringify(stats, null, 2));
    return stats;
  } catch (error) {
    console.error('❌ Error testing foundation stats:', error);
    throw error;
  }
}

async function simulateFoundationPurchase(email = 'test@example.com') {
  console.log('🛒 Simulating Foundation purchase for:', email);

  try {
    // Get current count
    const currentCount = await getFoundationCount(redis);
    console.log('Before purchase - Foundation members:', currentCount);

    // Simulate successful payment (increment counter)
    const newCount = await incrementFoundation(redis);
    console.log('After purchase - Foundation members:', newCount);

    // Store user data (simulating webhook)
    const userData = {
      email,
      tier: 'foundation',
      price: 2900, // €29.00 in cents
      purchaseDate: new Date().toISOString(),
      paymentStatus: 'completed'
    };

    await setUser(redis, email, userData);
    console.log('User data stored:', userData);

    return { newCount, userData };
  } catch (error) {
    console.error('❌ Error simulating purchase:', error);
    throw error;
  }
}

async function checkUserPremiumStatus(email = 'test@example.com') {
  console.log('👤 Checking premium status for:', email);

  try {
    const userData = await getUser(redis, email);
    if (userData && Object.keys(userData).length > 0) {
      // userData is already parsed by Upstash Redis
      console.log('User premium status:', userData);
      return {
        isActive: userData.paymentStatus === 'completed',
        tier: userData.tier,
        purchaseDate: userData.purchaseDate
      };
    } else {
      console.log('User not found - not premium');
      return { isActive: false, tier: null, purchaseDate: null };
    }
  } catch (error) {
    console.error('❌ Error checking user status:', error);
    throw error;
  }
}

async function resetTestData() {
  console.log('🔄 Resetting test data...');

  try {
    // Reset Foundation counter to 0
    await redis.set(keys.fcount(), 0);

    // Remove test user
    await redis.del(keys.user('test@example.com'));

    console.log('✅ Test data reset');
  } catch (error) {
    console.error('❌ Error resetting test data:', error);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Starting Upstash Redis Tests...\n');

  try {
    // Test 1: Check initial state
    console.log('=== Test 1: Foundation Stats ===');
    await testFoundationStats();
    console.log('');

    // Test 2: Simulate purchase
    console.log('=== Test 2: Simulate Purchase ===');
    const purchase = await simulateFoundationPurchase('test@example.com');
    console.log('');

    // Test 3: Check updated stats
    console.log('=== Test 3: Updated Foundation Stats ===');
    await testFoundationStats();
    console.log('');

    // Test 4: Check user status
    console.log('=== Test 4: User Premium Status ===');
    await checkUserPremiumStatus('test@example.com');
    console.log('');

    // Test 5: Simulate multiple purchases
    console.log('=== Test 5: Multiple Purchases ===');
    for (let i = 1; i <= 3; i++) {
      await simulateFoundationPurchase(`user${i}@test.com`);
    }
    await testFoundationStats();
    console.log('');

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    // Uncomment to reset after tests
    // await resetTestData();
  }
}

// Run tests
runTests();