import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

async function findAllKeys() {
  console.log('🔍 Searching for ALL keys related to thomas.seiger@gmail.com...\n');

  const allKeys = await redis.keys('*thomas*');
  console.log(`Found ${allKeys.length} keys with "thomas":\n`);

  for (const key of allKeys) {
    console.log(`📦 ${key}`);

    try {
      const data = await redis.hgetall(key);
      if (data && Object.keys(data).length > 0) {
        console.log(`   Version: ${data.version || 'none'}`);
        console.log(`   Tasks: ${data.app_data?.tasks?.length || 'none'}`);
        console.log(`   Email: ${data.email || 'none'}`);
        console.log(`   Status: ${data.status || 'none'}`);
      } else {
        const strData = await redis.get(key);
        console.log(`   Value: ${strData ? strData.toString().substring(0, 50) + '...' : 'none'}`);
      }
    } catch (e) {
      console.log(`   Error reading: ${e.message}`);
    }
    console.log('');
  }

  // Also check the exact key
  console.log('📦 Direct key: sn:u:thomas.seiger@gmail.com');
  const directData = await redis.hgetall('sn:u:thomas.seiger@gmail.com');
  console.log(`   Version: ${directData.version}`);
  console.log(`   Tasks: ${directData.app_data?.tasks?.length}`);
  console.log(`   Access Token: ${directData.access_token?.substring(0, 20)}...`);
}

findAllKeys();
