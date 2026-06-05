const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const ensureTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const email = 'test@carental.com';
        await User.deleteOne({ email }); // Clear key if exists

        const user = new User({
            email,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            phone: '1234567890',
            role: 'customer'
        });

        await user.save();
        console.log(`Test user created: ${email} / password123`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

ensureTestUser();
