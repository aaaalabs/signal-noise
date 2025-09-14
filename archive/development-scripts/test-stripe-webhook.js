// Test script for Stripe webhooks in Signal/Noise
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testStripeWebhook() {
  console.log('🔗 Testing Stripe Webhook...');

  try {
    // Simulate a completed payment webhook event
    const webhookPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_foundationpayment123',
          object: 'checkout.session',
          payment_status: 'paid',
          customer_email: 'test@foundation.com',
          amount_total: 2900, // €29.00 in cents
          metadata: {
            tier: 'foundation',
            firstName: 'Thomas'
          }
        }
      }
    };

    console.log('Webhook Payload:');
    console.log(JSON.stringify(webhookPayload, null, 2));

    // Test local webhook endpoint
    const response = await fetch('http://localhost:3000/api/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ Webhook response:', result);
    } else {
      console.log('❌ Webhook failed with status:', response.status);
    }

  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

async function testFoundationStatsAfterWebhook() {
  console.log('📊 Testing Foundation Stats after webhook...');

  try {
    const response = await fetch('http://localhost:3000/api/foundation-stats');

    if (response.ok) {
      const stats = await response.json();
      console.log('✅ Updated Foundation Stats:');
      console.log(JSON.stringify(stats, null, 2));
    } else {
      console.log('❌ Foundation stats failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error getting foundation stats:', error.message);
  }
}

async function runWebhookTests() {
  console.log('🚀 Starting Stripe Webhook Tests...\n');

  // Test webhook processing
  await testStripeWebhook();
  console.log('');

  // Test stats update
  await testFoundationStatsAfterWebhook();
  console.log('');

  console.log('✅ Webhook tests completed!');
}

runWebhookTests();