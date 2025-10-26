/**
 * Clone Premium User Data to Dev Test Account
 *
 * Copies sn:u:thomas.seiger@gmail.com => sn:u:dev@signal-noise.test
 * For testing Premium features in DevPanel without affecting production data
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

const SOURCE_EMAIL = 'thomas.seiger@gmail.com';
const TARGET_EMAIL = 'dev@signal-noise.test';

async function cloneDevUser() {
  console.log('🔄 Cloning Premium user data...');
  console.log(`   Source: ${SOURCE_EMAIL}`);
  console.log(`   Target: ${TARGET_EMAIL}`);
  console.log('');

  try {
    // Get source user data
    const sourceKey = `sn:u:${SOURCE_EMAIL}`;
    const sourceData = await redis.hgetall(sourceKey);

    if (!sourceData || Object.keys(sourceData).length === 0) {
      console.log('❌ Source user not found:', sourceKey);
      return;
    }

    console.log('✅ Source user found');
    console.log('📊 User data:', {
      status: sourceData.status,
      tier: sourceData.tier,
      payment_type: sourceData.payment_type,
      payment_status: sourceData.payment_status,
      fields: Object.keys(sourceData).length
    });
    console.log('');

    // Clone to target user
    const targetKey = `sn:u:${TARGET_EMAIL}`;

    // Update email field
    const clonedData = {
      ...sourceData,
      email: TARGET_EMAIL, // Override with dev email
      cloned_from: SOURCE_EMAIL,
      cloned_at: Date.now().toString()
    };

    // Write to Redis
    await redis.hset(targetKey, clonedData);

    console.log('✅ Cloned to dev account:', targetKey);
    console.log('📊 Dev account data:', {
      email: clonedData.email,
      status: clonedData.status,
      tier: clonedData.tier,
      cloned_from: clonedData.cloned_from
    });
    console.log('');

    // Verify
    const verifyData = await redis.hgetall(targetKey);
    if (verifyData && Object.keys(verifyData).length > 0) {
      console.log('✅ Verification successful');
      console.log('🎉 Dev account ready for testing!');
      console.log('');
      console.log('📝 Test in DevPanel:');
      console.log('   1. Press Cmd+K');
      console.log('   2. Click "AI Coach Debug"');
      console.log('   3. AI Coach button should appear');
    } else {
      console.log('❌ Verification failed - dev account not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run
cloneDevUser();
