// Comprehensive test scenarios for Stripe integration
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

class StripeTestScenarios {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.scenarios = [];
  }

  async resetFoundationCounter(count = 0) {
    await redis.set('foundation_members_count', count);
    console.log(`🔄 Reset Foundation counter to ${count}`);
  }

  async simulateWebhook(eventData) {
    const response = await fetch(`${this.baseUrl}/api/stripe-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      },
      body: JSON.stringify(eventData)
    });

    return {
      status: response.status,
      text: await response.text()
    };
  }

  async getFoundationStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/foundation-stats`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async checkUserStatus(email) {
    return await redis.get(`user:${email}`);
  }

  // Scenario 1: Normal Foundation Purchase
  async testFoundationPurchase() {
    console.log('📝 Scenario 1: Normal Foundation Purchase');

    const webhookEvent = {
      id: 'evt_foundation_test',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_foundation_123',
          payment_status: 'paid',
          customer_email: 'foundation@test.com',
          amount_total: 2900,
          metadata: {
            tier: 'foundation',
            firstName: 'Foundation'
          }
        }
      }
    };

    const beforeStats = await this.getFoundationStats();
    console.log('Before:', beforeStats?.foundationMembers || 0, 'members');

    const result = await this.simulateWebhook(webhookEvent);
    console.log('Webhook result:', result.status === 200 ? '✅' : '❌');

    const afterStats = await this.getFoundationStats();
    console.log('After:', afterStats?.foundationMembers || 0, 'members');

    const userStatus = await this.checkUserStatus('foundation@test.com');
    console.log('User stored:', userStatus ? '✅' : '❌');

    return result.status === 200;
  }

  // Scenario 2: Foundation Limit Reached
  async testFoundationLimitReached() {
    console.log('📝 Scenario 2: Foundation Limit Reached');

    // Set counter to 99
    await this.resetFoundationCounter(99);

    // Test 100th purchase (last Foundation spot)
    const webhook100 = {
      id: 'evt_foundation_100',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_foundation_100',
          payment_status: 'paid',
          customer_email: 'member100@test.com',
          amount_total: 2900,
          metadata: { tier: 'foundation', firstName: 'Member100' }
        }
      }
    };

    await this.simulateWebhook(webhook100);
    const stats100 = await this.getFoundationStats();
    console.log('100th member - Available:', stats100.isAvailable);

    // Test 101st purchase (should trigger Early Adopter)
    const webhook101 = {
      id: 'evt_early_adopter_101',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_early_adopter_101',
          payment_status: 'paid',
          customer_email: 'member101@test.com',
          amount_total: 4900,
          metadata: { tier: 'early_adopter', firstName: 'EarlyAdopter101' }
        }
      }
    };

    await this.simulateWebhook(webhook101);
    const stats101 = await this.getFoundationStats();
    console.log('101st member - Available:', stats101.isAvailable);
    console.log('Current tier:', stats101.currentTier);
    console.log('Current price:', stats101.currentPrice);

    return !stats101.isAvailable && stats101.currentTier === 'early_adopter';
  }

  // Scenario 3: Duplicate Email Purchase
  async testDuplicateEmail() {
    console.log('📝 Scenario 3: Duplicate Email Purchase');

    const email = 'duplicate@test.com';

    // First purchase
    const webhook1 = {
      id: 'evt_duplicate_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_duplicate_1',
          payment_status: 'paid',
          customer_email: email,
          amount_total: 2900,
          metadata: { tier: 'foundation', firstName: 'Duplicate1' }
        }
      }
    };

    const beforeCount = await redis.get('foundation_members_count') || 0;
    await this.simulateWebhook(webhook1);
    const afterFirst = await redis.get('foundation_members_count') || 0;

    console.log('First purchase - Counter increment:', afterFirst - beforeCount);

    // Second purchase (same email)
    const webhook2 = {
      id: 'evt_duplicate_2',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_duplicate_2',
          payment_status: 'paid',
          customer_email: email,
          amount_total: 2900,
          metadata: { tier: 'foundation', firstName: 'Duplicate2' }
        }
      }
    };

    await this.simulateWebhook(webhook2);
    const afterSecond = await redis.get('foundation_members_count') || 0;

    console.log('Second purchase - Counter increment:', afterSecond - afterFirst);
    console.log('Should not increment counter:', afterSecond === afterFirst ? '✅' : '❌');

    const userData = await this.checkUserStatus(email);
    console.log('User data updated:', userData.firstName === 'Duplicate2' ? '✅' : '❌');

    return afterSecond === afterFirst;
  }

  // Scenario 4: Failed Payment
  async testFailedPayment() {
    console.log('📝 Scenario 4: Failed Payment');

    const webhookFailed = {
      id: 'evt_failed_payment',
      type: 'checkout.session.async_payment_failed',
      data: {
        object: {
          id: 'cs_failed_123',
          payment_status: 'unpaid',
          customer_email: 'failed@test.com',
          amount_total: 2900,
          metadata: { tier: 'foundation', firstName: 'Failed' }
        }
      }
    };

    const beforeCount = await redis.get('foundation_members_count') || 0;
    const result = await this.simulateWebhook(webhookFailed);
    const afterCount = await redis.get('foundation_members_count') || 0;

    console.log('Failed payment processed:', result.status === 200 ? '✅' : '❌');
    console.log('Counter unchanged:', beforeCount === afterCount ? '✅' : '❌');

    const userData = await this.checkUserStatus('failed@test.com');
    console.log('No user data stored:', !userData ? '✅' : '❌');

    return beforeCount === afterCount && !userData;
  }

  // Scenario 5: Invalid Webhook Event
  async testInvalidWebhook() {
    console.log('📝 Scenario 5: Invalid Webhook Event');

    const invalidWebhook = {
      id: 'evt_invalid',
      type: 'customer.created', // Wrong event type
      data: {
        object: {
          id: 'cus_invalid',
          email: 'invalid@test.com'
        }
      }
    };

    const result = await this.simulateWebhook(invalidWebhook);
    console.log('Invalid event handled gracefully:', result.status === 200 ? '✅' : '❌');

    return result.status === 200;
  }

  // Run all scenarios
  async runAllScenarios() {
    console.log('🚀 Starting Stripe Test Scenarios...\n');

    // Reset to clean state
    await this.resetFoundationCounter(0);
    await redis.del('user:foundation@test.com');
    await redis.del('user:member100@test.com');
    await redis.del('user:member101@test.com');
    await redis.del('user:duplicate@test.com');

    const results = [];

    try {
      results.push(await this.testFoundationPurchase());
      console.log('');

      results.push(await this.testFoundationLimitReached());
      console.log('');

      // Reset for duplicate test
      await this.resetFoundationCounter(5);
      results.push(await this.testDuplicateEmail());
      console.log('');

      results.push(await this.testFailedPayment());
      console.log('');

      results.push(await this.testInvalidWebhook());
      console.log('');

      const passed = results.filter(r => r).length;
      const total = results.length;

      console.log(`📊 Test Results: ${passed}/${total} scenarios passed`);

      if (passed === total) {
        console.log('🎉 All Stripe scenarios passed!');
      } else {
        console.log('❌ Some scenarios failed. Check logs above.');
      }

    } catch (error) {
      console.error('💥 Scenario testing failed:', error);
    }
  }
}

// Check if server is running
async function checkServerRunning() {
  try {
    const response = await fetch('http://localhost:3000/api/foundation-stats');
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServerRunning();

  if (!serverRunning) {
    console.log('❌ Development server not running. Please start with: npm run dev');
    console.log('   Then run this test script again.');
    return;
  }

  const tester = new StripeTestScenarios();
  await tester.runAllScenarios();
}

main();