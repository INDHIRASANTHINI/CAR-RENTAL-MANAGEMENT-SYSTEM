const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Offer = require('../models/Offer');
const AdminWallet = require('../models/AdminWallet');
const { generateTransactionId } = require('../utils/helpers');

exports.processPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, method, cardDetails, offerId, discountAmount, upiDetails } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const finalAmount = amount - (discountAmount || 0);

    // Create payment record
    const payment = new Payment({
      bookingId,
      customerId: req.user.userId,
      amount,
      discountAmount: discountAmount || 0,
      finalAmount,
      offerId,
      method,
      transactionId: generateTransactionId(),
      lastFourDigits: cardDetails?.lastFourDigits,
      status: 'completed', // Simulation
      upiDetails: upiDetails || {}
    });

    if (method === 'upi') {
      // Logic for UPI QR Simulation
      payment.upiDetails = {
        upiId: upiDetails?.upiId || 'merchant@upi',
        transactionRef: payment.transactionId,
        qrCode: `upi://pay?pa=merchant@upi&am=${finalAmount}&tr=${payment.transactionId}`
      };
    }

    await payment.save();

    // Update booking payment status
    booking.paymentStatus = 'completed';
    booking.paymentId = payment._id;
    booking.status = 'confirmed';
    booking.totalCost = finalAmount; // Update booking total if discount applied
    await booking.save();

    // Transfer money to Admin Wallet
    let wallet = await AdminWallet.findOne();
    if (!wallet) {
      wallet = new AdminWallet({ balance: 0, transactions: [] });
    }

    wallet.balance += finalAmount;
    wallet.transactions.push({
      paymentId: payment._id,
      amount: finalAmount,
      type: 'credit',
      description: `Payment for booking ${booking.bookingId}`
    });
    wallet.lastUpdated = new Date();
    await wallet.save();

    // If offer was used, update usage
    if (offerId) {
      await Offer.findByIdAndUpdate(offerId, { $inc: { usedCount: 1 } });
    }

    // Create notification
    await Notification.create({
      userId: req.user.userId,
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of $${finalAmount} for booking ${booking.bookingId} was successful via ${method}.`,
      relatedId: booking._id
    });

    // Populate booking for the response (needed for receipt)
    await booking.populate('customerId carId');

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
      booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('offerId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ customerId: req.user.userId })
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'carId' },
          { path: 'customerId' }
        ]
      })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const wallet = await AdminWallet.findOne().populate('transactions.paymentId');
    const totalPayments = await Payment.countDocuments({ status: 'completed' });

    // Simple report grouping by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const earningsReport = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$finalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      balance: wallet?.balance || 0,
      totalPayments,
      earningsReport,
      transactionHistory: wallet?.transactions || []
    });
  } catch (error) {
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status === 'refunded') return res.status(400).json({ message: 'Already refunded' });

    payment.status = 'refunded';
    await payment.save();

    // Deduct from Admin Wallet
    const wallet = await AdminWallet.findOne();
    if (wallet) {
      wallet.balance -= payment.finalAmount;
      wallet.transactions.push({
        paymentId: payment._id,
        amount: payment.finalAmount,
        type: 'debit',
        description: `Refund for booking ${payment.bookingId}`
      });
      await wallet.save();
    }

    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.paymentStatus = 'failed';
      await booking.save();
    }

    res.json({ message: 'Payment refunded successfully', payment });
  } catch (error) {
    next(error);
  }
};

