const express = require('express');
const router = express.Router();
const {  getAllDoctors,getProfile, updateProfile } = require('../controllers/doctorController');
const isAuthenticated = require("../middleware/authentication");

router.get('/profile/:email',isAuthenticated, getProfile);
router.put('/profile/:email', isAuthenticated,updateProfile);
router.get('/getAllDoctors',getAllDoctors);

module.exports = router;