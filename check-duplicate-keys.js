import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate user keys...\n');

  const email = 'thomas.seiger@gmail.com';
  const expectedKey = `sn:u:${email}`;

  console.log('📧 Looking for:', email);
  console.log('🔑 Expected key:', expectedKey);
  console.log('');

  // Get all user keys
  const allKeys = await redis.keys('sn:u:*');
  console.log(`📊 Total user keys: ${allKeys.length}\n`);

  // Filter for our user
  const matchingKeys = allKeys.filter(key =>
    key.toLowerCase().includes(email.toLowerCase()) ||
    key === expectedKey
  );

  console.log(`🎯 Matching keys for ${email}:`);
  matchingKeys.forEach(key => {
    console.log(`   ${key === expectedKey ? '✅' : '⚠️'} ${key}`);
  });
  console.log('');

  // Check each matching key
  for (const key of matchingKeys) {
    const userData = await redis.hgetall(key);
    console.log(`📦 Key: ${key}`);
    console.log(`   Version: ${userData.version || 'none'}`);
    console.log(`   Email: ${userData.email || 'none'}`);
    console.log(`   Tasks: ${userData.app_data?.tasks?.length || 0}`);
    console.log(`   Access token: ${userData.access_token?.substring(0, 12)}...`);
    console.log('');
  }

  // Summary
  if (matchingKeys.length > 1) {
    console.log('🚨 CRITICAL: Multiple keys found for same user!');
    console.log('   This causes /api/tasks and /api/sync to use different keys!');
  } else if (matchingKeys.length === 1 && matchingKeys[0] === expectedKey) {
    console.log('✅ Only one correct key found');
  } else {
    console.log('⚠️ Key mismatch or missing key');
  }
}

checkDuplicates();
