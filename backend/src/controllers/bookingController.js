const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { generateBookingId, calculateRentalDays, calculateTotalCost } = require('../utils/helpers');
const { sendBookingConfirmation } = require('../utils/email');

exports.createBooking = async (req, res, next) => {
  try {
    const { carId, pickupDate, returnDate, pickupLocation, returnLocation, insuranceSelected, specialRequests } = req.body;

    // Find car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.status !== 'available') {
      return res.status(400).json({ message: 'Car is currently not available for rental' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      carId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        {
          pickupDate: { $lte: new Date(returnDate) },
          returnDate: { $gte: new Date(pickupDate) }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'This car is already reserved for the selected dates' });
    }

    // Calculate costs
    const rentalDays = calculateRentalDays(pickupDate, returnDate);
    const insuranceCost = insuranceSelected ? car.insuranceCost * rentalDays : 0;
    const totalCost = calculateTotalCost(car.pricePerDay, rentalDays, insuranceCost);

    // Create booking
    const booking = new Booking({
      bookingId: generateBookingId(),
      customerId: req.user.userId,
      carId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      rentalDays,
      totalCost,
      insuranceSelected,
      insuranceCost,
      specialRequests
    });

    await booking.save();

    // Create notification
    await Notification.create({
      userId: req.user.userId,
      type: 'booking',
      title: 'Booking Created',
      message: `Your booking ${booking.bookingId} has been created`,
      relatedId: booking._id
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.userId })
      .populate('carId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('carId')
      .populate('customerId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Create notification
    await Notification.create({
      userId: booking.customerId,
      type: 'cancellation',
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} has been cancelled`,
      relatedId: booking._id
    });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('customerId')
      .populate('carId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
};
