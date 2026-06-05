const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

console.log('Script started...');

const updateImagePaths = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars`);

        for (const car of cars) {
            // console.log(`Processing ${car.make} ${car.model}`);
            if (car.images && car.images.length > 0) {
                const oldImage = car.images[0];

                // Check if it's already correct
                if (oldImage.includes('/cars/')) {
                    console.log(`  SKIPPING: Already has /cars/ path: ${oldImage}`);
                    continue;
                }

                // Fix path: /images/filename.png -> /images/cars/filename.png
                // Only if it starts with /images/ and NOT /images/cars/
                if (oldImage.startsWith('/images/')) {
                    const filename = oldImage.split('/images/')[1];
                    const newImage = `/images/cars/${filename}`;

                    car.images = [newImage]; // Assuming 1 image for now or mapping all
                    // Better map all
                    car.images = car.images.map(img => {
                        if (img.startsWith('/images/') && !img.includes('/cars/')) {
                            return img.replace('/images/', '/images/cars/');
                        }
                        return img;
                    });

                    await car.save();
                    console.log(`  UPDATED: ${car.make} -> ${car.images[0]}`);
                }
            }
        }

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
};

updateImagePaths();
