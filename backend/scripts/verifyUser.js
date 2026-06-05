const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const verifyUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        const user = await User.findOne({ email: 'test456@example.com' });
        if (user) {
            console.log(`ROLE:${user.role}`);
        } else {
            console.log('NOT_FOUND');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

verifyUser();
