const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specialization: String,
  yearsOfExperience: Number,
  aboutMe: String,
  profileCompleted: {
    type: Boolean,
    default: function () {
      return !!(this.specialization && this.yearsOfExperience && this.aboutMe);
    }
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;

