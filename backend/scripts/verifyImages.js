const mongoose = require('mongoose');
const Car = require('../src/models/Car');
require('dotenv').config();

const verifyImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        const cars = await Car.find({});
        console.log(JSON.stringify(cars.map(c => ({
            id: c._id,
            make: c.make,
            model: c.model,
            images: c.images,
            imageUrl: c.imageUrl // Check if this field exists
        })), null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

verifyImages();
