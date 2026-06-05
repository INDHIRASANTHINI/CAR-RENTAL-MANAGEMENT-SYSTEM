const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const updateImagePaths = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const cars = await Car.find({});
        let updatedCount = 0;

        for (const car of cars) {
            let modified = false;
            const newImages = car.images.map(img => {
                if (img.startsWith('/images/') && !img.startsWith('/images/cars/')) {
                    modified = true;
                    return img.replace('/images/', '/images/cars/');
                }
                return img;
            });

            if (modified) {
                car.images = newImages;
                await car.save();
                console.log(`Updated ${car.make} ${car.model}: ${newImages[0]}`);
                updatedCount++;
            }
        }

        console.log(`Total cars updated: ${updatedCount}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateImagePaths();
