const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, offerController.getOffers);
router.get('/active', authenticate, offerController.getActiveOffers);
router.post('/validate', authenticate, offerController.validateOffer);

// Admin only routes
router.post('/', authenticate, authorize('admin'), offerController.createOffer);
router.put('/:id', authenticate, authorize('admin'), offerController.updateOffer);
router.delete('/:id', authenticate, authorize('admin'), offerController.deleteOffer);

module.exports = router;
