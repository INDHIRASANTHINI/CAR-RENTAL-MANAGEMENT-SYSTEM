const axios = require('axios');

const registerUser = async () => {
    try {
        const uniqueId = Date.now();
        const newUser = {
            email: `newuser${uniqueId}@example.com`,
            password: 'password123',
            firstName: 'New',
            lastName: 'User',
            phone: '9876543210'
        };

        const response = await axios.post('http://localhost:5000/api/auth/register', newUser);
        console.log('Registration Status:', response.status);
        console.log('Registered User:', response.data.user.email);
    } catch (error) {
        console.error('Registration Error:', error.response ? error.response.data : error.message);
    }
};

registerUser();
