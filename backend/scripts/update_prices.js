const mongoose = require('mongoose');
const Car = require('../src/models/Car');
require('dotenv').config({ path: '../.env' }); // Adjusted path if needed

async function updatePrices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const cars = await Car.find({});
    
    for (const car of cars) {
      let modified = false;
      if (car.pricePerDay < 1000) {
        car.pricePerDay = car.pricePerDay * 40;
        modified = true;
      }
      if (car.insuranceCost && car.insuranceCost < 200) {
        car.insuranceCost = car.insuranceCost * 40;
        modified = true;
      }
      
      if (modified) {
        await car.save();
        console.log(`Updated ${car.make} ${car.model} to price: ${car.pricePerDay}, insurance: ${car.insuranceCost}`);
      } else {
        console.log(`Skipped ${car.make} ${car.model} (Price is already ${car.pricePerDay})`);
      }
    }
    
    console.log('Done updating prices.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updatePrices();
