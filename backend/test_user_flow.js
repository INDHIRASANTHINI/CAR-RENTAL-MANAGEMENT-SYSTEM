const axios = require('axios');

const testUserFlow = async () => {
    const newUser = {
        email: `testuser_${Date.now()}@test.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890'
    };

    try {
        // 1. Register
        console.log('Registering user...');
        await axios.post('http://localhost:5000/api/auth/register', newUser);
        // 2. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: newUser.email,
            password: newUser.password
        });
        const token = loginRes.data.accessToken;

        // 3. Fetch Settings
        console.log('Fetching bookings...');
        await axios.get('http://localhost:5000/api/bookings/my-bookings', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Bookings fetch successful.');

        // 4. Fetch Payments
        console.log('Fetching payments...');
        await axios.get('http://localhost:5000/api/payments/my-payments', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Payments fetch successful.');

        console.log('--- TEST PASSED ---');

    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
};

testUserFlow();
