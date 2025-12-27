import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testDirectRestAPI() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  console.log('🧪 Testing Upstash Redis REST API directly (bypassing SDK)...\n');

  // Direct REST API call to hgetall
  const response = await fetch(
    `${url}/hgetall/sn:u:thomas.seiger@gmail.com`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  console.log('📡 Direct REST API Response:');
  console.log('   Status:', response.status);
  console.log('   Result type:', data.result ? typeof data.result : 'none');
  console.log('');

  if (data.result) {
    // REST API returns array format: [key, value, key, value, ...]
    const hash = {};
    for (let i = 0; i < data.result.length; i += 2) {
      hash[data.result[i]] = data.result[i + 1];
    }

    console.log('📊 Parsed Data:');
    console.log('   Version:', hash.version);
    console.log('   Email:', hash.email);
    console.log('   Status:', hash.status);
    console.log('   Access Token:', hash.access_token?.substring(0, 20) + '...');

    // Parse app_data
    let tasks = 0;
    if (hash.app_data) {
      try {
        const appData = typeof hash.app_data === 'string'
          ? JSON.parse(hash.app_data)
          : hash.app_data;
        tasks = appData.tasks?.length || 0;
        console.log('   Tasks:', tasks);
        console.log('   First Task:', appData.tasks?.[0]?.text || 'none');
      } catch (e) {
        console.log('   Tasks: Error parsing -', e.message);
      }
    }

    console.log('');
    console.log('✅ Direct REST API Test Complete');
    console.log('');
    console.log('🔍 Comparison:');
    console.log('   Direct REST API: v' + hash.version + ', ' + tasks + ' tasks');
    console.log('   Expected (Node SDK): v12362, 277 tasks');
    console.log('   API /api/tasks returns: v11180, 275 tasks');
    console.log('');

    // removed hard coded hash version
    if (hash.version === process.env.HASH_VERSION) {
      console.log('✅ REST API returns FRESH data - SDK might be caching!');
    } else {
      console.log('❌ REST API also returns stale data - problem is in Redis itself');
    }
  } else {
    console.log('❌ No result returned');
    console.log('Response:', JSON.stringify(data, null, 2));
  }
}

testDirectRestAPI();
