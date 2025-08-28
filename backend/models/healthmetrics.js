const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true
    },
    diastolic: {
      type: Number,
      required: true
    }
  },
  weight: {
    type: Number,
    required: true
  },
  sugarLevel: {
    type: Number,
    required: true
  },
  oxygenLevel: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HealthMetric', healthMetricSchema);