const express = require('express');
const {getCars, getCar, createCar, updateCar, deleteCar} = require('../controllers/cars');
const router= express.Router();

const bookingRouter = require('./bookings');
const {protect, authorize} = require('../middleware/auth');


router.use('/:carId/bookings/',bookingRouter);
router.route('/').get(getCars).post(protect, authorize('admin','provider'), createCar);
router.route('/:id').get(getCar).put(protect,authorize('admin','provider'), updateCar).delete(protect, authorize('admin','provider'), deleteCar);

module.exports = router;
