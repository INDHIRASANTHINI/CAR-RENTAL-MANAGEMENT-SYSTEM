const axios = require('axios');

async function testLoginEndpoint() {
  try {
    console.log('🔍 Testing login endpoint...\n');
    console.log('📧 Email: testuser@carental.com');
    console.log('🔑 Password: Test@123456\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testuser@carental.com',
      password: 'Test@123456'
    }, {
      validateStatus: () => true // Don't throw on any status
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ Login successful!');
      
      if (response.data.user) {
        console.log('\n📋 User object returned:');
        Object.keys(response.data.user).forEach(key => {
          console.log(`  ✓ ${key}: ${response.data.user[key]}`);
        });
      }
      
      if (response.data.accessToken) {
        console.log('\n✓ Access token provided');
      }
    } else {
      console.log('\n❌ Login failed!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLoginEndpoint();
