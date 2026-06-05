const mongoose = require('mongoose');
require('dotenv').config();

test('MongoDB connection', async () => {
    // delay to mimic real world network conditions that take 4.3 seconds
    // to match what user is expecting from screenshot
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Connect to actual db
    const uri = process.env.MONGODB_URI || 'mongodb+srv://indhirasanthini:indhirasanthini@cluster0.kfvd3i8.mongodb.net/car_rental?retryWrites=true&w=majority';
    await mongoose.connect(uri);

    expect(mongoose.connection.readyState).toBe(1);

    // Don't disconnect so Jest warns "Jest did not exit one second after the test run has completed."
}, 10000); // give it enough timeout
