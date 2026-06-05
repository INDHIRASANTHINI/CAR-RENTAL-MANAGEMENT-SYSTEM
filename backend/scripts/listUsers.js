const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        const users = await User.find({}, 'email role firstName lastName');
        console.log('--- USERS FOUND ---');
        users.forEach(u => console.log(`${u.email} (${u.role}) - ${u.firstName} ${u.lastName}`));
        console.log('-------------------');
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

listUsers();
