const axios = require('axios');

const testFix = async () => {
    try {
        console.log('Logging in as debug admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin_debug@test.com',
            password: 'password123'
        });
        const token = loginRes.data.accessToken;
        console.log('Login successful.');

        const uniquePlate = 'ABC-' + Date.now().toString().slice(-4);

        // Correct payload structure matching the frontend fix
        const correctPayload = {
            make: 'Toyota',
            model: 'Camry Hybrid',
            year: 2025,
            pricePerDay: 75,
            location: { branch: 'Downtown' }, // Correct structure
            transmission: 'automatic',
            fuelType: 'hybrid',
            seatingCapacity: 5,
            description: 'Test Description for verified car',
            licensePlate: uniquePlate, // Added field
            images: ['http://example.com/car.jpg']
        };

        console.log('Sending CORRECT payload to add car...');
        const res = await axios.post('http://localhost:5000/api/cars', correctPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('SUCCESS: Car added.', res.data);

    } catch (error) {
        console.error('FAILURE:', error.response ? error.response.data : error.message);
    }
};

testFix();
