// Test script for Stripe checkout creation
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testStripeCheckout() {
  console.log('💳 Testing Stripe Checkout Creation...');

  const testPayload = {
    email: 'test@foundation.com',
    firstName: 'Thomas',
    paymentType: 'foundation'
  };

  try {
    const response = await fetch('http://localhost:3000/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Checkout created successfully:');
    console.log('- Session ID:', data.sessionId);
    console.log('- Checkout URL:', data.url);
    console.log('- Customer Email:', data.customer_email);

  } catch (error) {
    console.error('❌ Error testing Stripe checkout:', error.message);
  }
}

async function testFoundationStatsAPI() {
  console.log('📊 Testing Foundation Stats API...');

  try {
    const response = await fetch('http://localhost:3000/api/foundation-stats');

    if (!response.ok) {
      console.error('❌ API Error:', response.status);
      return;
    }

    const stats = await response.json();
    console.log('✅ Foundation Stats:', JSON.stringify(stats, null, 2));

  } catch (error) {
    console.error('❌ Error testing foundation stats:', error.message);
  }
}

async function runStripeTests() {
  console.log('🚀 Starting Stripe Integration Tests...\n');

  // Test 1: Foundation Stats API
  await testFoundationStatsAPI();
  console.log('');

  // Test 2: Stripe Checkout Creation
  await testStripeCheckout();
  console.log('');

  console.log('✅ Stripe tests completed!');
}

runStripeTests();