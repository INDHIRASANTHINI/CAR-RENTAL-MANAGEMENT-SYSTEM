const axios = require('axios');

const testUserLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@carental.com',
            password: 'password123'
        });

        console.log('User Login Status:', response.status);
        console.log('User Role in Response:', response.data.user.role);
        console.log('Full Response Body:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error('Login Failed:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testUserLogin();
