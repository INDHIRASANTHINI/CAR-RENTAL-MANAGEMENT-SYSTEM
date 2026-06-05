const mongoose = require('mongoose');
const Car = require('../src/models/Car');
require('dotenv').config({ path: '../.env' }); // Adjusted path if needed

async function checkCars() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const cars = await Car.find({});
    console.log(cars.map(c => `${c.make} ${c.model} - ${c.pricePerDay}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCars();
