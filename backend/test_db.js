require('dotenv').config();
const mongoose = require('mongoose');

console.log('START: Attempting to connect to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB connected!');
        setTimeout(() => process.exit(0), 1000);
    })
    .catch(err => {
        console.error('FAILURE: Error occurred!');
        console.error(err);
        setTimeout(() => process.exit(1), 1000);
    });
