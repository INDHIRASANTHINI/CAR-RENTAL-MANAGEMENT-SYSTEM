const mongoose = require('mongoose');
const Car = require('./src/models/Car');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const checkImagesDeep = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        const cars = await Car.find({});
        const publicDir = path.join(__dirname, '../frontend/public');

        console.log('--- MISSING IMAGES ---');
        let missingCount = 0;
        for (const car of cars) {
            if (!car.images || car.images.length === 0) {
                console.log(`[NO_IMAGE_FIELD] ${car.make} ${car.model}`);
                missingCount++;
                continue;
            }

            const imgPath = car.images[0];
            const fullPath = path.join(publicDir, imgPath);

            if (!fs.existsSync(fullPath)) {
                console.log(`[FILE_NOT_FOUND] ${car.make} ${car.model}: ${imgPath}`);
                missingCount++;
            }
        }

        if (missingCount === 0) console.log('All images OK!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImagesDeep();
