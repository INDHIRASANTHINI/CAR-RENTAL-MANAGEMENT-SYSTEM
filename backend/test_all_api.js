const axios = require('axios');

const testAPICall = async () => {
    try {
        console.log('Testing API connection...');
        
        // Test 1: Health check
        const healthResponse = await axios.get('http://localhost:5000/api/health');
        console.log('✓ Health Check:', healthResponse.data);
        
        // Test 2: Admin login
        const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@carental.com',
            password: 'admin123'
        });
        console.log('✓ Admin Login Response:', {
            status: adminLoginResponse.status,
            user: adminLoginResponse.data.user,
            tokenLength: adminLoginResponse.data.accessToken.length
        });
        
        // Test 3: User login
        const userLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@carental.com',
            password: 'password123'
        });
        console.log('✓ User Login Response:', {
            status: userLoginResponse.status,
            user: userLoginResponse.data.user,
            tokenLength: userLoginResponse.data.accessToken.length
        });
        
        console.log('\n✓ All API tests passed! Backend is working correctly.');
        
    } catch (error) {
        console.error('✗ API Test Failed:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            error: error.message
        });
    }
};

testAPICall();
