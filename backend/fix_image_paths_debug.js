const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const updateImagePaths = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const cars = await Car.find({});

        for (const car of cars) {
            console.log(`Checking ${car.make} ${car.model}: ${JSON.stringify(car.images)}`);

            let modified = false;
            const newImages = car.images.map(img => {
                const needsUpdate = img.startsWith('/images/') && !img.startsWith('/images/cars/');
                console.log(`  Img: ${img}, Needs Update: ${needsUpdate}`);

                if (needsUpdate) {
                    modified = true;
                    return img.replace('/images/', '/images/cars/');
                }
                return img;
            });

            if (modified) {
                car.images = newImages;
                await car.save();
                console.log(`  -> UPDATED to: ${JSON.stringify(newImages)}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateImagePaths();
