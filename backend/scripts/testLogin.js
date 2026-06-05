const axios = require('axios');

async function testLogin() {
    try {
        console.log('Attempting login with admin@example.com...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'AdminPassword123!'
        });

        console.log('LOGIN SUCCESS!');
        console.log('Status:', response.status);
        console.log('User Role:', response.data.user.role);
        console.log('Token received:', !!response.data.accessToken);

    } catch (error) {
        console.error('LOGIN FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received (Server down?)');
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
