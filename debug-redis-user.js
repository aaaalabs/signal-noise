import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function debugUser() {
  const email = 'thomas.seiger@gmail.com';
  const userKey = `sn:u:${email}`;

  console.log('🔍 Fetching user data from Redis...');
  console.log('📦 Key:', userKey);
  console.log('');

  try {
    // Get all hash fields
    const userData = await redis.hgetall(userKey);

    if (!userData || Object.keys(userData).length === 0) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User found! Complete hash data:');
    console.log('=====================================\n');

    // Print all fields
    for (const [field, value] of Object.entries(userData)) {
      if (field === 'app_data') {
        // Parse app_data if it's a string
        try {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value;
          console.log(`📦 ${field}:`);
          console.log(`   - Type: ${typeof value}`);
          console.log(`   - Size: ${JSON.stringify(value).length} bytes`);
          console.log(`   - Tasks: ${parsed.tasks?.length || 0}`);
          console.log(`   - History: ${parsed.history?.length || 0}`);
          console.log(`   - Badges: ${parsed.badges?.length || 0}`);
          console.log(`   - Settings:`, parsed.settings);
          console.log('');

          // Show first 3 tasks
          if (parsed.tasks && parsed.tasks.length > 0) {
            console.log('   📋 First 3 tasks:');
            parsed.tasks.slice(0, 3).forEach((task, i) => {
              console.log(`      ${i+1}. [${task.type}] ${task.text.substring(0, 50)}`);
              console.log(`         Timestamp: ${task.timestamp}`);
              console.log(`         Completed: ${task.completed}`);
              console.log('');
            });
          }

          // Show last 3 tasks
          if (parsed.tasks && parsed.tasks.length > 3) {
            console.log('   📋 Last 3 tasks:');
            parsed.tasks.slice(-3).forEach((task, i) => {
              console.log(`      ${parsed.tasks.length - 2 + i}. [${task.type}] ${task.text.substring(0, 50)}`);
              console.log(`         Timestamp: ${task.timestamp}`);
              console.log(`         Completed: ${task.completed}`);
              console.log('');
            });
          }
        } catch (e) {
          console.log(`📦 ${field}: ${JSON.stringify(value).substring(0, 200)}...`);
        }
      } else if (field === 'access_token') {
        console.log(`🔑 ${field}: ${value.substring(0, 12)}... (hidden)`);
      } else {
        console.log(`📌 ${field}: ${value}`);
      }
    }

    console.log('\n=====================================');
    console.log('📊 Summary:');
    console.log(`   - Email: ${userData.email}`);
    console.log(`   - Version: ${userData.version}`);
    console.log(`   - Last Active: ${userData.last_active ? new Date(parseInt(userData.last_active)).toISOString() : 'never'}`);
    console.log(`   - Tier: ${userData.tier}`);
    console.log(`   - Status: ${userData.status}`);
    console.log(`   - First Name: ${userData.first_name}`);

  } catch (error) {
    console.error('❌ Error fetching user data:', error);
  }
}

debugUser();
