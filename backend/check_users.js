const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        // Find users with role 'admin'
        const admins = await User.find({ role: 'admin' }, 'email role firstName lastName');

        console.log('--- ADMIN USERS ---');
        console.log(JSON.stringify(admins, null, 2));

        const allUsers = await User.find({}, 'email role');
        console.log('--- ALL USERS SUMMARY ---');
        console.log(JSON.stringify(allUsers.map(u => ({ email: u.email, role: u.role })), null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
