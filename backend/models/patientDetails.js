const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [0, "Age cannot be negative"],
    max: [120, "Age cannot be more than 120"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now,
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["male", "female", "non-binary", "other"],
  },
  bloodGroup: {
    type: String,
    required: [true, "Blood group is required"],
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
  allergies: {
    type: String,
    trim: true,
  },
  medications: {
    type: String,
    trim: true,
  },
  medicalHistory: {
    type: String,
    trim: true,
  },
  leftEyeImage: {
    path: String,
    originalName: String,
    mimetype: String,
  },
  rightEyeImage: {
    path: String,
    originalName: String,
    mimetype: String,
  },
  leftEyePrediction: { type: String },
  rightEyePrediction: { type: String },
  leftEyeHRPrediction : {type : String},
  rightEyeHRPrediction : {type : String},

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
