// Test email sending via API endpoint
const testEmailSend = async () => {
  try {
    console.log('🔧 Testing email send via API endpoint...');

    // Test Welcome Email via API
    console.log('\n📧 Testing Welcome Email API...');
    const welcomeResponse = await fetch('http://localhost:3000/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'thomas.seiger@gmail.com',
        firstName: 'Thomas',
        tierName: 'Foundation Member'
      })
    });

    if (welcomeResponse.ok) {
      const welcomeResult = await welcomeResponse.json();
      console.log('Welcome Email Result:', welcomeResult);
    } else {
      console.log('Welcome Email Failed:', welcomeResponse.status, await welcomeResponse.text());
    }

    // Test Magic Link Email via API
    console.log('\n🔐 Testing Magic Link Email API...');
    const magicResponse = await fetch('http://localhost:3000/api/send-magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'thomas.seiger@gmail.com',
        verifyUrl: 'https://signal-noise.app/?magic=test-token-123',
        tierName: 'Foundation Member'
      })
    });

    if (magicResponse.ok) {
      const magicResult = await magicResponse.json();
      console.log('Magic Link Result:', magicResult);
    } else {
      console.log('Magic Link Failed:', magicResponse.status, await magicResponse.text());
    }

  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('\n💡 Note: Make sure to have the API server running first');
    console.log('   Run: npm run dev');
    console.log('   Then: node test-email-send.js');
  }
};

testEmailSend();