const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car ID is required']
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required']
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  returnLocation: {
    type: String,
    required: [true, 'Return location is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  rentalDays: {
    type: Number,
    default: 1,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  insuranceSelected: {
    type: Boolean,
    default: false
  },
  insuranceCost: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  specialRequests: String,
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
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ carId: 1 });
bookingSchema.index({ pickupDate: 1, returnDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
