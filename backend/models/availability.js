const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlots: [{
    type: Number,
    min: 1,
    max: 9
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

availabilitySchema.index({ doctorId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Availability', availabilitySchema);