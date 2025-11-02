import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

const TARGET_TOKEN = 'snk_c47480431db571b9da61338152fdd56edbcc7ebddce23c550617c6ce72e0eaa3';

async function findAllTokenMatches() {
  console.log('🔍 Searching for ALL keys with matching access_token...\n');
  console.log('Target token:', TARGET_TOKEN.substring(0, 20) + '...\n');

  const allKeys = await redis.keys('sn:u:*');
  const userKeys = allKeys.filter(k => !k.includes(':sessions'));

  console.log(`Found ${userKeys.length} user keys to check\n`);

  const matches = [];

  for (const key of userKeys) {
    const userData = await redis.hgetall(key);
    if (userData.access_token === TARGET_TOKEN) {
      matches.push({
        key,
        email: userData.email,
        version: userData.version,
        tasks: userData.app_data?.tasks?.length || 0,
        status: userData.status,
        last_active: userData.last_active ? new Date(parseInt(userData.last_active)).toISOString() : 'never'
      });
    }
  }

  console.log(`\n✅ Found ${matches.length} key(s) with matching access_token:\n`);

  matches.forEach((match, index) => {
    console.log(`Match #${index + 1}:`);
    console.log(`   Key: ${match.key}`);
    console.log(`   Email: ${match.email}`);
    console.log(`   Version: ${match.version}`);
    console.log(`   Tasks: ${match.tasks}`);
    console.log(`   Status: ${match.status}`);
    console.log(`   Last Active: ${match.last_active}`);
    console.log('');
  });

  if (matches.length > 1) {
    console.log('🚨 CRITICAL: Multiple keys found with same access_token!');
    console.log('   This explains why /api/tasks returns stale data!');
    console.log('   The loop might be finding the FIRST match (stale) instead of the correct one.\n');
  } else if (matches.length === 1) {
    console.log('✅ Only one key matches - token loop should work correctly');
    console.log('   Version:', matches[0].version);
    console.log('   Expected: 12362\n');

    if (matches[0].version !== 12362 && matches[0].version !== '12362') {
      console.log('🚨 CRITICAL: The matched key has STALE data!');
      console.log('   This is the root cause - wrong data in this key.\n');
    }
  } else {
    console.log('❌ No matches found - token not in database');
  }
}

findAllTokenMatches();
