const express = require('express');
const router = express.Router();
const { getBookedSlots, createBooking, getUserBookings } = require('../controllers/bookingController');

router.get('/user/:userId', getUserBookings);
router.get('/:doctorId/:date', getBookedSlots);
router.post('/', createBooking);
module.exports = router;