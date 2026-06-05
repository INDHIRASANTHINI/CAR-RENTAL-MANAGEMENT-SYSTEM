const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const checkCarImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const cars = await Car.find({}, 'make model images');
        console.log(`Found ${cars.length} cars.`);

        cars.forEach(car => {
            console.log(`${car.make} ${car.model}: ${JSON.stringify(car.images)}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCarImages();
