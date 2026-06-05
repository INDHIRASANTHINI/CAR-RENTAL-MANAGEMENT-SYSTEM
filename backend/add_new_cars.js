const mongoose = require('mongoose');
const Car = require('./src/models/Car');
require('dotenv').config();

const addCars = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental');
        console.log('Connected to MongoDB');

        const newCars = [
            {
                licensePlate: 'MC1234',
                make: 'Mercedes-Benz',
                model: 'C-Class',
                year: 2023,
                pricePerDay: 120,
                status: 'available',
                images: ['/images/cars/mercedes_c_class.png'],
                fuelType: 'petrol',
                transmission: 'automatic',
                seatingCapacity: 5,
                features: ['Leather Seats', 'Navigation', 'Sunroof', 'Bluetooth']
            },
            {
                licensePlate: 'AQ7890',
                make: 'Audi',
                model: 'Q7',
                year: 2023,
                pricePerDay: 150,
                status: 'available',
                images: ['/images/cars/audi_q7.png'],
                fuelType: 'diesel',
                transmission: 'automatic',
                seatingCapacity: 7,
                features: ['7 Seats', 'All-Wheel Drive', 'Premium Sound', 'Leather Interior']
            },
            {
                licensePlate: 'FM4567',
                make: 'Ford',
                model: 'Mustang GT',
                year: 2023,
                pricePerDay: 140,
                status: 'available',
                images: ['/images/cars/ford_mustang_gt.png'],
                fuelType: 'petrol',
                transmission: 'automatic',
                seatingCapacity: 4,
                features: ['V8 Engine', 'Sport Suspension', 'Touchscreen', 'Backup Camera']
            },
            {
                licensePlate: 'TM3321',
                make: 'Tesla',
                model: 'Model 3',
                year: 2023,
                pricePerDay: 130,
                status: 'available',
                images: ['/images/cars/tesla_model_3.png'],
                fuelType: 'electric',
                transmission: 'automatic',
                seatingCapacity: 5,
                features: ['Autopilot', 'Electric', 'Glass Roof', 'Heated Seats']
            }
        ];

        for (const carData of newCars) {
            const exists = await Car.findOne({ licensePlate: carData.licensePlate });
            if (exists) {
                await Car.updateOne({ licensePlate: carData.licensePlate }, carData);
                console.log(`Updated: ${carData.make} ${carData.model}`);
            } else {
                await new Car(carData).save();
                console.log(`Added: ${carData.make} ${carData.model}`);
            }
        }

        console.log('Successfully processed all cars.');
        process.exit(0);

    } catch (error) {
        console.error('Error adding cars:', error);
        process.exit(1);
    }
};

addCars();
