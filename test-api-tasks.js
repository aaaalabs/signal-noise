// Test /api/tasks endpoint directly
// Run with: ACCESS_TOKEN=your_token node test-api-tasks.js
const accessToken = process.env.ACCESS_TOKEN || process.argv[2];

async function testTasksAPI() {
  console.log('🧪 Testing /api/tasks GET endpoint...\n');

  try {
    const response = await fetch('https://signal-noise.vercel.app/api/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Response data:');
      console.log('   - success:', data.success);
      console.log('   - premium:', data.premium);
      console.log('   - version:', data.version);
      console.log('   - task count:', data.data?.tasks?.length || 0);
      console.log('   - first task:', data.data?.tasks?.[0]?.text?.substring(0, 50) || 'none');
      console.log('   - first task timestamp:', data.data?.tasks?.[0]?.timestamp || 'none');

      console.log('\n📊 Comparison:');
      console.log('   Redis version: 12356');
      console.log('   API version:  ', data.version);
      console.log('   Delta:        ', 12356 - (data.version || 0));

      if (data.version !== 12356) {
        console.log('\n🚨 VERSION MISMATCH DETECTED!');
        console.log('   API is returning STALE data!');
      } else {
        console.log('\n✅ Versions match!');
      }
    } else {
      console.log('❌ Request failed:', response.statusText);
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTasksAPI();
