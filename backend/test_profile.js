const axios = require('axios');

const testProfile = async () => {
    const newUser = {
        email: `testuser_${Date.now()}@test.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890'
    };

    try {
        // 1. Register
        await axios.post('http://localhost:5000/api/auth/register', newUser);
        // 2. Login
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: newUser.email,
            password: newUser.password
        });
        const token = loginRes.data.accessToken;

        // 3. Fetch Profile
        console.log('Fetching profile...');
        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile fetch successful:', profileRes.data.email);

        console.log('--- TEST PASSED ---');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testProfile();
