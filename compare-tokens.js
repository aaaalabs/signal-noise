import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function compareTokens() {
  const user = await redis.hgetall('sn:u:thomas.seiger@gmail.com');

  const redisToken = user.access_token;

  console.log('🔍 Current Redis Token:\n');
  console.log('   ', redisToken);
  console.log('');
  console.log('📋 Check your browser console:');
  console.log('   Run: JSON.parse(localStorage.getItem("sessionData")).sessionToken');
  console.log('');
  console.log('🔑 Redis User Info:');
  console.log('   Email:', user.email);
  console.log('   Version:', user.version);
  console.log('   Tasks:', user.app_data?.tasks?.length);
  console.log('   Status:', user.status);
  console.log('   Last Active:', new Date(parseInt(user.last_active)).toISOString());
}

compareTokens();
