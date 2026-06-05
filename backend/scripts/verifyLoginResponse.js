const axios = require('axios');

const verifyLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'AdminPassword123!'
        });

        console.log('Login Response User Object:');
        console.log(JSON.stringify(response.data.user, null, 2));

        if (response.data.user.phone) {
            console.log('SUCCESS: Phone number is present.');
        } else {
            console.error('FAILURE: Phone number is MISSING.');
        }

    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
};

verifyLogin();
