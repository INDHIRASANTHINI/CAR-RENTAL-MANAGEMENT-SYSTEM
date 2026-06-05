const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

// Customer routes
router.post('/', authenticate, authorize('customer'), bookingController.createBooking);
router.get('/my-bookings', authenticate, authorize('customer'), bookingController.getCustomerBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.patch('/:id/cancel', authenticate, authorize('customer'), bookingController.cancelBooking);

// Admin routes
router.get('/', authenticate, authorize('admin'), bookingController.getAllBookings);
router.patch('/:id/status', authenticate, authorize('admin'), bookingController.updateBookingStatus);

module.exports = router;
