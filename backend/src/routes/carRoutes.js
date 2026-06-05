const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/auth');

router.get('/', optionalAuthenticate, carController.getAllCars);
router.get('/:id', carController.getCarById);

router.post('/', authenticate, authorize('admin'), carController.addCar);
router.post('/bulk/insert', carController.bulkAddCars);
router.put('/:id', authenticate, authorize('admin'), carController.updateCar);
router.delete('/:id', authenticate, authorize('admin'), carController.deleteCar);
router.patch('/:id/status', authenticate, authorize('admin'), carController.updateCarStatus);

module.exports = router;
