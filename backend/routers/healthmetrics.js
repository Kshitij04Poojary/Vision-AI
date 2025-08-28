const express = require('express');
const router = express.Router();
const { getHealthMetrics, addHealthMetric } = require('../controllers/healthMetrics');
// Routes now include email parameter
router.get('/metrics/:email',  getHealthMetrics);
router.post('/metrics/:email',  addHealthMetric);

module.exports = router;