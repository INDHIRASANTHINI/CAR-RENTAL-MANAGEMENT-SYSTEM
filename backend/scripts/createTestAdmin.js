const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createTestAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        // Check if test admin exists
        let admin = await User.findOne({ email: 'admin@carental.com' });
        
        if (admin) {
            console.log('Admin user already exists, updating role to admin');
            admin.role = 'admin';
            await admin.save();
            console.log('✓ Admin user role updated to admin');
        } else {
            console.log('Creating new test admin user...');
            admin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@carental.com',
                password: 'Admin@123456',
                phone: '1234567890',
                role: 'admin'
            });
            await admin.save();
            console.log('✓ Test admin user created successfully!');
        }

        console.log('\n📧 Admin Login Credentials:');
        console.log('Email: admin@carental.com');
        console.log('Password: Admin@123456');
        console.log('\nLogin at: http://localhost:3000/login');
        console.log('Select "Admin Login" tab');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createTestAdmin();
