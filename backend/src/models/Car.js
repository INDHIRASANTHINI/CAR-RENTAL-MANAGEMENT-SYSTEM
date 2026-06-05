const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    uppercase: true
  },
  make: {
    type: String,
    required: [true, 'Car make is required']
  },
  model: {
    type: String,
    required: [true, 'Car model is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1990, 'Year must be after 1990']
  },
  color: String,
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: [true, 'Fuel type is required']
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic'],
    required: [true, 'Transmission is required']
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: 2,
    max: 8
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: 0
  },
  insuranceCost: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'sold'],
    default: 'available'
  },
  images: [String],
  features: [String],
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationExpiry: Date,
  location: {
    branch: String,
    latitude: Number,
    longitude: Number
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
carSchema.index({ status: 1, pricePerDay: 1 });
carSchema.index({ 'location.branch': 1 });

module.exports = mongoose.model('Car', carSchema);
