const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('customer'), paymentController.processPayment);
router.get('/my-payments', authenticate, authorize('customer'), paymentController.getCustomerPayments);
router.get('/stats', authenticate, authorize('admin'), paymentController.getAdminStats);
router.get('/:id', authenticate, paymentController.getPaymentById);
router.post('/:id/refund', authenticate, authorize('customer'), paymentController.refundPayment);

module.exports = router;
