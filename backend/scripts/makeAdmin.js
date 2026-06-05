const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
    console.log('Please provide an email address. Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
}

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`SUCCESS: User ${email} has been promoted to ADMIN.`);
        console.log('You can now log in using the Admin tab.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

promoteUser();
