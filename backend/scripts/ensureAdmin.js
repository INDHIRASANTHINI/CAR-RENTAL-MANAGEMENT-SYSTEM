const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const ensureAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        const email = 'admin@example.com';
        const password = 'AdminPassword123!';
        const adminData = {
            firstName: 'Admin',
            lastName: 'User',
            phone: '1234567890',
            role: 'admin',
            password: password
        };

        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} found. Updating password and ensuring admin role...`);
            user.password = password;
            user.role = 'admin';
            user.firstName = adminData.firstName;
            user.lastName = adminData.lastName;
            user.phone = adminData.phone;
            await user.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log(`User ${email} not found. Creating new admin user...`);
            user = new User({
                email,
                ...adminData
            });
            await user.save();
            console.log('Admin user created successfully.');
        }

        console.log('\n================================================');
        console.log('ADMIN CREDENTIALS:');
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log('================================================\n');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

ensureAdmin();
