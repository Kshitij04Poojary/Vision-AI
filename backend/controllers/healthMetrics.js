const HealthMetric = require('../models/healthmetrics');

exports.getHealthMetrics = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Get all metrics for the user, sorted by timestamp
    const allMetrics = await HealthMetric.find({ email })
      .sort({ timestamp: -1 });

    // Current metrics will be the most recent entry
    const currentMetrics = allMetrics[0] || null;
    
    // Send both current metrics and history
    res.json({
      currentMetrics,
      history: allMetrics
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ message: 'Failed to fetch health metrics' });
  }
};

exports.addHealthMetric = async (req, res) => {
  try {
    const { email } = req.params;
    const { bloodPressure, weight, sugarLevel, oxygenLevel } = req.body;

    const newMetric = new HealthMetric({
      email,
      bloodPressure,
      weight,
      sugarLevel,
      oxygenLevel
    });

    await newMetric.save();

    res.status(201).json({
      message: 'Health metrics added successfully',
      metrics: newMetric
    });
  } catch (error) {
    console.error('Error adding health metrics:', error);
    res.status(400).json({ message: 'Failed to add health metrics' });
  }
};