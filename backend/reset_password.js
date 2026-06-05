const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const email = 'admin@carental.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        user.password = 'admin123'; // The pre-save hook will hash this
        await user.save();

        console.log(`Password reset for ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
