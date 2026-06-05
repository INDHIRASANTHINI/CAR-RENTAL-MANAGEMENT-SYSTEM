const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createTempAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const email = 'admin_debug@test.com';
        const password = 'password123';

        // Delete if exists
        await User.deleteOne({ email });

        const admin = new User({
            email,
            password,
            firstName: 'Debug',
            lastName: 'Admin',
            phone: '0000000000',
            role: 'admin'
        });

        await admin.save();
        console.log('Temp admin created:', email);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createTempAdmin();
