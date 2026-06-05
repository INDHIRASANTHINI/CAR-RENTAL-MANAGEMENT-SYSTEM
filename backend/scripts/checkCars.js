const mongoose = require('mongoose');
const Car = require('../src/models/Car');
require('dotenv').config();

const checkCars = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars.`);

        console.log(JSON.stringify(cars.map(c => ({ id: c._id, make: c.make, model: c.model, color: c.color })), null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkCars();
