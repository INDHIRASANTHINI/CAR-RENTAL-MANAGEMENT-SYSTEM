const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const listAllCars = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        const cars = await Car.find({});
        console.log(JSON.stringify(cars.map(c => ({
            id: c._id,
            make: c.make,
            model: c.model,
            images: c.images
        })), null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listAllCars();
