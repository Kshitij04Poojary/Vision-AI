const express = require('express');
const router = express.Router();
const {getAvailableTimeslots,saveAvailability} = require('../controllers/availabitlity');
const isAuthenticated = require("../middleware/authentication");


router.get('/:doctorId/:date',getAvailableTimeslots);

router.post('/',isAuthenticated,saveAvailability);

module.exports = router;    