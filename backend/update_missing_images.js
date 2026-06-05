const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const updateMissingImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');

        // Updates
        const updates = [
            { make: 'Honda', model: 'Civic', image: '/images/cars/honda_civic.png' },
            { make: 'BMW', model: 'X5', image: '/images/cars/bmw_x5.png' }
        ];

        for (const update of updates) {
            const car = await Car.findOne({ make: update.make, model: update.model });
            if (car) {
                car.images = [update.image];
                await car.save();
                console.log(`Updated ${car.make} ${car.model} to ${update.image}`);
            } else {
                console.log(`Car not found: ${update.make} ${update.model}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateMissingImages();
