// Test LIVE /api/tasks endpoint
// Run with: ACCESS_TOKEN=your_token node test-live-api.js

const accessToken = process.env.ACCESS_TOKEN || process.argv[2];

if (!accessToken) {
  console.log('❌ Please provide access token:');
  console.log('   ACCESS_TOKEN=your_token node test-live-api.js');
  process.exit(1);
}

async function testLiveAPI() {
  console.log('🧪 Testing LIVE /api/tasks endpoint...\n');

  try {
    const response = await fetch('https://signal-noise.app/api/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    console.log('📡 Response Headers:');
    console.log('   Status:', response.status);
    console.log('   Cache-Control:', response.headers.get('Cache-Control') || 'none');
    console.log('   Pragma:', response.headers.get('Pragma') || 'none');
    console.log('   Expires:', response.headers.get('Expires') || 'none');
    console.log('');

    if (response.ok) {
      const data = await response.json();

      console.log('✅ API Response:');
      console.log('   Task count:', data.data?.tasks?.length || 0);
      console.log('   Version:', data.version || 'none');
      console.log('   First task:', data.data?.tasks?.[0]?.text || 'none');
      console.log('   First timestamp:', data.data?.tasks?.[0]?.timestamp || 'none');
      console.log('');

      console.log('🔍 Expected from Redis:');
      console.log('   Tasks: 279');
      console.log('   Version: 12360');
      console.log('   First task: Test4');
      console.log('   First timestamp: 2025-11-02T08:54:45.515Z');
      console.log('');

      if (data.data?.tasks?.length === 279) {
        console.log('✅ TASK COUNT MATCHES! API is returning fresh data!');
      } else {
        console.log(`❌ MISMATCH! API returns ${data.data?.tasks?.length}, Redis has 279`);
        console.log('   This confirms stale data issue');
      }

      if (data.version === 12360) {
        console.log('✅ VERSION MATCHES!');
      } else {
        console.log(`❌ VERSION MISMATCH! API returns ${data.version}, Redis has 12360`);
      }

    } else {
      console.log('❌ Request failed:', response.status, response.statusText);
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLiveAPI();
