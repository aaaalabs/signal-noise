import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function compare() {
  const email = 'thomas.seiger@gmail.com';
  const userKey = `sn:u:${email}`;

  console.log('🔍 Comparing Redis vs localStorage data...\n');

  try {
    // Get Redis data
    const userData = await redis.hgetall(userKey);
    const redisData = userData.app_data;
    const redisVersion = parseInt(userData.version || '0');

    console.log('📦 REDIS DATA:');
    console.log('   Version:', redisVersion);
    console.log('   Tasks:', redisData.tasks.length);
    console.log('   First task:', redisData.tasks[0]?.text);
    console.log('   First timestamp:', redisData.tasks[0]?.timestamp);
    console.log('   Last modified:', new Date(parseInt(userData.last_modified)).toISOString());
    console.log('');

    // Get what client would receive from /api/tasks
    console.log('📡 WHAT CLIENT RECEIVES (simulated /api/tasks):');
    console.log('   Version:', redisVersion);
    console.log('   Tasks:', redisData.tasks.length);
    console.log('');

    // Ask user for localStorage data
    console.log('📋 NOW CHECK YOUR BROWSER CONSOLE:');
    console.log('   Run: JSON.parse(localStorage.getItem("signal_noise_data"))');
    console.log('   Check:');
    console.log('   - How many tasks?');
    console.log('   - First task timestamp?');
    console.log('   - Any tasks from today (2025-11-02)?');
    console.log('');

    // Show first 5 and last 5 tasks from Redis
    console.log('📊 REDIS TASKS (first 5):');
    redisData.tasks.slice(0, 5).forEach((task, i) => {
      const date = new Date(task.timestamp);
      console.log(`   ${i+1}. [${date.toISOString().split('T')[0]}] ${task.text.substring(0, 40)} - ${task.completed ? '✅' : '❌'}`);
    });
    console.log('');

    console.log('📊 REDIS TASKS (last 5):');
    const lastFive = redisData.tasks.slice(-5);
    lastFive.forEach((task, i) => {
      const date = new Date(task.timestamp);
      const idx = redisData.tasks.length - 5 + i + 1;
      console.log(`   ${idx}. [${date.toISOString().split('T')[0]}] ${task.text.substring(0, 40)} - ${task.completed ? '✅' : '❌'}`);
    });
    console.log('');

    // Check for today's tasks
    const today = new Date().toISOString().split('T')[0]; // 2025-11-02
    const todayTasks = redisData.tasks.filter(task => {
      return task.timestamp.startsWith(today);
    });

    console.log(`🗓️ TASKS FROM TODAY (${today}):`);
    if (todayTasks.length === 0) {
      console.log('   ❌ NO TASKS FROM TODAY IN REDIS!');
      console.log('   This confirms data loss issue.');
    } else {
      console.log(`   ✅ Found ${todayTasks.length} tasks from today`);
      todayTasks.forEach((task, i) => {
        console.log(`   ${i+1}. ${task.text} - ${task.completed ? '✅' : '❌'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

compare();
