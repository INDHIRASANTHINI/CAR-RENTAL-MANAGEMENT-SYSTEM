const axios = require('axios');

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@carental.com',
            password: 'admin123' // I'm guessing the password based on standard defaults, or I will reset it if this fails.
        });

        console.log('Login Status:', response.status);
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

testLogin();
