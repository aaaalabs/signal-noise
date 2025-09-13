// Test script for API logic without server
import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function testFoundationLogic() {
  console.log('🧪 Testing Foundation Logic...');

  try {
    // Get current Foundation member count
    const foundationCount = await redis.get('foundation_members_count') || 0;
    console.log('Current Foundation members:', foundationCount);

    // Test Foundation availability logic
    const isFoundationAvailable = foundationCount < 100;
    console.log('Foundation available:', isFoundationAvailable);

    // Test tier pricing logic
    let tierInfo;
    if (isFoundationAvailable) {
      tierInfo = {
        name: 'Signal/Noise - Foundation Access',
        description: 'Foundation member - lifetime access to AI Coach and all features',
        amount: 2900, // €29.00 in cents
        tier: 'foundation'
      };
    } else {
      tierInfo = {
        name: 'Signal/Noise - Early Adopter',
        description: 'Early adopter - lifetime access to AI Coach and all features',
        amount: 4900, // €49.00 in cents
        tier: 'early_adopter'
      };
    }

    console.log('Tier Info:', tierInfo);
    return tierInfo;

  } catch (error) {
    console.error('❌ Error testing foundation logic:', error);
    throw error;
  }
}

async function testStripeSession(tierInfo) {
  console.log('💳 Testing Stripe Session Creation...');

  try {
    const email = 'test@foundation.com';
    const firstName = 'Thomas';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: tierInfo.name,
              description: tierInfo.description,
            },
            unit_amount: tierInfo.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      metadata: {
        tier: tierInfo.tier,
        firstName: firstName || '',
      },
      success_url: 'http://localhost:3000?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000',
    });

    console.log('✅ Stripe session created:');
    console.log('- Session ID:', session.id);
    console.log('- Payment Status:', session.payment_status);
    console.log('- Amount Total:', session.amount_total, 'cents');
    console.log('- Customer Email:', session.customer_email);
    console.log('- Tier:', session.metadata.tier);

    return session;

  } catch (error) {
    console.error('❌ Error creating Stripe session:', error);
    throw error;
  }
}

async function testWebhookLogic(sessionId, tierInfo) {
  console.log('🔗 Testing Webhook Logic...');

  try {
    // Simulate successful payment webhook
    const email = 'test@foundation.com';
    const firstName = 'Thomas';

    // Get current count before increment
    const beforeCount = await redis.get('foundation_members_count') || 0;
    console.log('Before webhook - Foundation members:', beforeCount);

    // Simulate incrementing Foundation counter (only for foundation tier)
    if (tierInfo.tier === 'foundation') {
      const afterCount = await redis.incr('foundation_members_count');
      console.log('After webhook - Foundation members:', afterCount);
    }

    // Store user premium data
    const userData = {
      email,
      firstName,
      tier: tierInfo.tier,
      sessionId,
      purchaseDate: new Date().toISOString(),
      paymentStatus: 'completed'
    };

    await redis.set(`user:${email}`, userData);
    console.log('✅ User data stored:', userData);

    return userData;

  } catch (error) {
    console.error('❌ Error testing webhook logic:', error);
    throw error;
  }
}

async function runAPITests() {
  console.log('🚀 Starting API Logic Tests...\n');

  try {
    // Test 1: Foundation availability and pricing logic
    console.log('=== Test 1: Foundation Logic ===');
    const tierInfo = await testFoundationLogic();
    console.log('');

    // Test 2: Stripe session creation
    console.log('=== Test 2: Stripe Session ===');
    const session = await testStripeSession(tierInfo);
    console.log('');

    // Test 3: Webhook processing logic
    console.log('=== Test 3: Webhook Logic ===');
    await testWebhookLogic(session.id, tierInfo);
    console.log('');

    console.log('✅ All API logic tests completed successfully!');

  } catch (error) {
    console.error('💥 API test failed:', error);
  }
}

runAPITests();