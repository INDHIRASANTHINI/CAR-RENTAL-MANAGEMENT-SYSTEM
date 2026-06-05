const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const images = [
    { make: 'Audi', model: 'Q7', path: '/images/cars/audi_q7.png' },
    { make: 'BMW', model: 'X5', path: '/images/cars/bmw_x5.png' },
    { make: 'Ford', model: 'Mustang GT', path: '/images/cars/ford_mustang_gt.png' },
    { make: 'Honda', model: 'City', path: '/images/cars/honda_city.png' },
    { make: 'Honda', model: 'Civic', path: '/images/cars/honda_civic.png' },
    { make: 'Hyundai', model: 'Creta', path: '/images/cars/hyundai_creta.png' },
    { make: 'Maruti', model: 'Swift', path: '/images/cars/maruti_swift.png' },
    { make: 'Mercedes-Benz', model: 'C-Class', path: '/images/cars/mercedes_c_class.png' },
    { make: 'Tata', model: 'Nexon', path: '/images/cars/tata_nexon.png' },
    { make: 'Tesla', model: 'Model 3', path: '/images/cars/tesla_model_3.png' },
    { make: 'Toyota', model: 'Camry', path: '/images/cars/toyota_camry.png' },
    { make: 'tata', model: 'tiago', path: '/images/cars/tata_nexon.png' },
    { make: 'kia', model: '2020', path: '/images/cars/audi_q7.png' } // Fallback for Kia
];

const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        for (const img of images) {
            // Case-insensitive search for make and model
            const query = {
                make: { $regex: new RegExp('^' + img.make + '$', 'i') },
                model: { $regex: new RegExp('^' + img.model + '$', 'i') }
            };

            const car = await Car.findOne(query);
            if (car) {
                car.images = [img.path];
                await car.save();
                console.log(`Updated ${car.make} ${car.model} with ${img.path}`);
            } else {
                console.log(`Car not found: ${img.make} ${img.model}`);
            }
        }

        // Also check if any cars still have external URLs or invalid paths
        const allCars = await Car.find({});
        for (const car of allCars) {
            if (!car.images || car.images.length === 0 || car.images[0].startsWith('http') || car.images[0].includes('example.com')) {
                console.log(`Warning: ${car.make} ${car.model} still has invalid image: ${car.images}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error fixing images:', error);
        process.exit(1);
    }
};

fixImages();
