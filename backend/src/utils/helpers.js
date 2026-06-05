const { v4: uuidv4 } = require('uuid');

const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BOOKING-${timestamp}-${random}`;
};

const generateTransactionId = () => {
  return `TXN-${uuidv4().toUpperCase()}`;
};

const calculateRentalDays = (pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD - pickup);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
};

const calculateTotalCost = (pricePerDay, rentalDays, insuranceCost = 0, discount = 0) => {
  const basePrice = pricePerDay * rentalDays;
  const total = basePrice + insuranceCost - discount;
  return Math.max(0, total);
};

module.exports = {
  generateBookingId,
  generateTransactionId,
  calculateRentalDays,
  calculateTotalCost
};
