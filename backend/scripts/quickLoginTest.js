const axios = require('axios');

// Wait a moment for server to be ready, then test
setTimeout(async () => {
  try {
    console.log('🔍 Testing login endpoint...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testuser@carental.com',
      password: 'Test@123456'
    }, {
      validateStatus: () => true
    });
    
    console.log('✅ Response received!');
    console.log('Status:', response.status);
    console.log('\nData:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.user) {
      console.log('\n✅ User object contains:');
      Object.keys(response.data.user).forEach(key => {
        console.log(`  ✓ ${key}: ${response.data.user[key]}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}, 2000);

console.log('Waiting for server to be ready...');