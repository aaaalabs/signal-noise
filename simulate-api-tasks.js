import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Simulate EXACTLY what /api/tasks does
async function simulateAPITasks() {
  console.log('🔬 Simulating /api/tasks GET flow...\n');

  const accessToken = 'snk_c4748043431db571b9da61338152fdd56edbcc7ebddce23c550617';

  try {
    // EXACTLY what /api/tasks does:
    console.log('Step 1: redis.keys("sn:u:*")');
    const userKeys = await redis.keys('sn:u:*');
    console.log(`   Found ${userKeys.length} keys\n`);

    let userKey = null;
    let user = null;

    console.log('Step 2: Iterate through keys to find matching access_token');
    for (const key of userKeys) {
      if (key.includes(':sessions')) {
        console.log(`   Skipping: ${key}`);
        continue;
      }

      console.log(`   Checking: ${key}`);
      const userData = await redis.hgetall(key);

      if (userData.access_token === accessToken && userData.status === 'active') {
        userKey = key;
        user = userData;
        console.log(`   ✅ MATCH! Found user: ${userData.email}`);
        break;
      } else {
        console.log(`   ❌ No match (${userData.email || 'no email'})`);
      }
    }

    console.log('');

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('Step 3: Parse app_data');
    let appData = user.app_data;
    console.log(`   Type: ${typeof appData}`);
    console.log(`   Tasks: ${appData?.tasks?.length || 0}`);
    console.log('');

    console.log('Step 4: Construct response (EXACTLY as /api/tasks)');
    const version = parseInt(user.version || '0');
    const response = {
      success: true,
      data: appData,
      premium: true,
      version: version
    };

    console.log('📦 API Response would be:');
    console.log(`   version: ${response.version}`);
    console.log(`   tasks: ${response.data?.tasks?.length || 0}`);
    console.log(`   first task: ${response.data?.tasks?.[0]?.text || 'none'}`);
    console.log(`   first timestamp: ${response.data?.tasks?.[0]?.timestamp || 'none'}`);
    console.log('');

    console.log('🔍 Direct Redis check (bypass):');
    const directUser = await redis.hgetall(`sn:u:thomas.seiger@gmail.com`);
    console.log(`   version: ${directUser.version}`);
    console.log(`   tasks: ${directUser.app_data?.tasks?.length || 0}`);
    console.log(`   first task: ${directUser.app_data?.tasks?.[0]?.text || 'none'}`);
    console.log('');

    if (response.data?.tasks?.length !== directUser.app_data?.tasks?.length) {
      console.log('🚨 CRITICAL: Task count MISMATCH!');
      console.log('   API flow:', response.data?.tasks?.length);
      console.log('   Direct Redis:', directUser.app_data?.tasks?.length);
      console.log('');
      console.log('🔍 Debugging: Compare keys');
      console.log('   API found key:', userKey);
      console.log('   Direct key: sn:u:thomas.seiger@gmail.com');
      console.log('   Keys match:', userKey === 'sn:u:thomas.seiger@gmail.com');
    } else {
      console.log('✅ Task counts match!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

simulateAPITasks();
