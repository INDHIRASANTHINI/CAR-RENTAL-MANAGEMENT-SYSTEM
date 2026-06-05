const axios = require('axios');

const testAddCar = async () => {
    try {
        // 1. Login as Admin (assuming we have an admin user, otherwise we need to create one)
        // Using the admin credentials found/created in previous steps or verifyUser.js
        console.log('Logging in as admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin_debug@test.com',
            password: 'password123'
        });
        const token = loginRes.data.accessToken;
        console.log('Login successful, token received.');

        // 2. Try to add car with OLD payload structure
        console.log('Attempting to add car with OLD payload...');
        const oldPayload = {
            make: 'TestMake',
            model: 'TestModel',
            year: 2024,
            pricePerDay: 50,
            location: 'Test City', // Sending string instead of object
            transmission: 'Automatic',
            category: 'Sedan',
            seatingCapacity: 5,
            fuelType: 'Petrol',
            description: 'Test Description',
            features: []
            // Missing licensePlate
        };

        await axios.post('http://localhost:5000/api/cars', oldPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('FAILURE: Car added successfully (Unexpected for invalid payload)');

    } catch (error) {
        if (error.response) {
            console.log('SUCCESS: Request failed as expected with status:', error.response.status);
            console.log('Error data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAddCar();
