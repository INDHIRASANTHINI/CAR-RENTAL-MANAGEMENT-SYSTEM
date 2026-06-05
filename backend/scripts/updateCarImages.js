const mongoose = require('mongoose');
const Car = require('../src/models/Car');
require('dotenv').config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        const updates = [
            { model: 'Camry', image: '/images/cars/toyota_camry.png' },
            { model: 'Creta', image: '/images/cars/hyundai_creta.png' },
            { model: 'City', image: '/images/cars/honda_city.png' },
            { model: 'Nexon', image: '/images/cars/tata_nexon.png' },
            { model: 'Swift', image: '/images/cars/maruti_swift.png' }
        ];

        for (const update of updates) {
            const result = await Car.updateOne(
                { model: { $regex: update.model, $options: 'i' } },
                { $set: { images: [update.image] } }
            );
            if (result.matchedCount > 0) {
                console.log(`Updated ${update.model} with image ${update.image}`);
            } else {
                console.log(`Car model ${update.model} not found`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

updateImages();
