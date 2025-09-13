// Complete end-to-end Stripe purchase testing
import { config } from 'dotenv';
import { getFoundationCount } from './api/redis-helper.js';
import { Redis } from '@upstash/redis';

// Load environment variables
config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

class CompletePurchaseTest {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testEmail = 'test-purchase@foundation.com';
  }

  async checkServerRunning() {
    try {
      const response = await fetch(`${this.baseUrl}/api/foundation-stats`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Step 1: Check Foundation stats before purchase
  async checkInitialStats() {
    console.log('📊 Step 1: Checking initial Foundation stats...');

    const response = await fetch(`${this.baseUrl}/api/foundation-stats`);
    const stats = await response.json();

    console.log('Initial stats:', stats);
    return stats;
  }

  // Step 2: Create checkout session
  async createCheckoutSession() {
    console.log('💳 Step 2: Creating checkout session...');

    const response = await fetch(`${this.baseUrl}/api/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.testEmail,
        firstName: 'Test',
        paymentType: 'foundation'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Checkout failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('✅ Checkout session created:');
    console.log('- Session ID:', data.sessionId);
    console.log('- URL:', data.url?.substring(0, 50) + '...');

    return data;
  }

  // Step 3: Simulate successful payment webhook
  async simulateSuccessfulPayment(sessionId) {
    console.log('🔗 Step 3: Simulating successful payment webhook...');

    const webhookPayload = {
      id: 'evt_test_complete_purchase',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: sessionId,
          payment_status: 'paid',
          customer_email: this.testEmail,
          amount_total: 2900, // €29.00
          metadata: {
            tier: 'foundation',
            firstName: 'Test'
          }
        }
      }
    };

    const response = await fetch(`${this.baseUrl}/api/stripe-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Webhook failed: ${response.status} - ${error}`);
    }

    console.log('✅ Webhook processed successfully');
    return await response.text();
  }

  // Step 4: Verify Foundation stats updated
  async verifyStatsUpdated(initialStats) {
    console.log('🔍 Step 4: Verifying stats updated...');

    const response = await fetch(`${this.baseUrl}/api/foundation-stats`);
    const newStats = await response.json();

    console.log('Updated stats:', newStats);

    const expectedCount = initialStats.foundationMembers + 1;
    const actualCount = newStats.foundationMembers;

    if (actualCount === expectedCount) {
      console.log(`✅ Foundation counter correctly incremented: ${initialStats.foundationMembers} → ${actualCount}`);
      return true;
    } else {
      console.log(`❌ Foundation counter mismatch: expected ${expectedCount}, got ${actualCount}`);
      return false;
    }
  }

  // Step 5: Verify user data stored
  async verifyUserData() {
    console.log('👤 Step 5: Verifying user data stored...');

    // Check Redis directly for user data
    const userData = await redis.hgetall(`sn:u:${this.testEmail}`);

    if (userData && Object.keys(userData).length > 0) {
      console.log('✅ User data found:', {
        email: userData.email,
        tier: userData.tier,
        payment_type: userData.payment_type,
        status: userData.status
      });

      // Verify expected fields
      const checks = [
        userData.email === this.testEmail,
        userData.tier === 'foundation',
        userData.payment_type === 'lifetime',
        userData.status === 'active'
      ];

      if (checks.every(Boolean)) {
        console.log('✅ All user data fields correct');
        return true;
      } else {
        console.log('❌ Some user data fields incorrect');
        return false;
      }
    } else {
      console.log('❌ No user data found');
      return false;
    }
  }

  // Complete test flow
  async runCompleteTest() {
    console.log('🚀 Starting Complete Stripe Purchase Test...\n');

    try {
      // Check if server is running
      const serverRunning = await this.checkServerRunning();
      if (!serverRunning) {
        console.log('❌ Development server not running. Please start with: npm run dev');
        return false;
      }

      // Step 1: Initial stats
      const initialStats = await this.checkInitialStats();
      console.log('');

      // Step 2: Create checkout
      const checkoutData = await this.createCheckoutSession();
      console.log('');

      // Step 3: Simulate payment
      await this.simulateSuccessfulPayment(checkoutData.sessionId);
      console.log('');

      // Step 4: Verify counter incremented
      const statsCorrect = await this.verifyStatsUpdated(initialStats);
      console.log('');

      // Step 5: Verify user data
      const userDataCorrect = await this.verifyUserData();
      console.log('');

      // Final result
      if (statsCorrect && userDataCorrect) {
        console.log('🎉 Complete purchase test PASSED! All systems working correctly.');
        return true;
      } else {
        console.log('❌ Complete purchase test FAILED. Check logs above.');
        return false;
      }

    } catch (error) {
      console.error('💥 Test failed with error:', error.message);
      return false;
    }
  }

  // Cleanup test data
  async cleanup() {
    console.log('🧹 Cleaning up test data...');

    try {
      await redis.del(`sn:u:${this.testEmail}`);
      console.log('✅ Test user data cleaned up');
    } catch (error) {
      console.log('⚠️  Cleanup failed:', error.message);
    }
  }
}

// Run the test
async function main() {
  const tester = new CompletePurchaseTest();

  const success = await tester.runCompleteTest();

  if (success) {
    console.log('\n💡 Next steps:');
    console.log('- Test with real Stripe account');
    console.log('- Set up webhook endpoint in production');
    console.log('- Test with different email addresses');
  }

  // Cleanup
  await tester.cleanup();

  process.exit(success ? 0 : 1);
}

main();