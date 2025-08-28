const Doctor = require('../models/doctorDetails');
const mongoose = require('mongoose');
const User = require('../models/userModels')

const getProfile = async (req, res) => {
  try {
    const { email } = req.params; 

    console.log("🔍 Fetching doctor with email:", email);

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also fetch the doctor profile
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(200).json({
        name: user.name,
        email: user.email,
        specialization: '',
        yearsOfExperience: '',
        aboutMe: '',
        profileCompleted: false
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("❗ Error fetching doctor:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Received email in params:", email);
    console.log("Request body:", req.body);

    // Check if email exists
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        searchedEmail: email 
      });
    }

    // Find existing doctor entry with better error handling
    let doctor = await Doctor.findOne({ email });
    console.log("Existing doctor profile:", doctor);

    if (!doctor) {
      // Create new doctor profile
      doctor = new Doctor({
        doctorId: user._id,
        _id: user._id,
        name: user.name,
        email,
        specialization: req.body.specialization,
        yearsOfExperience: req.body.yearsOfExperience,
        aboutMe: req.body.aboutMe,
        profileCompleted: !!(req.body.specialization && req.body.yearsOfExperience && req.body.aboutMe)
      });
      console.log("Created new doctor profile:", doctor);
    } else {
      // Update existing doctor profile
      doctor.name = user.name;
      doctor.specialization = req.body.specialization;
      doctor.yearsOfExperience = req.body.yearsOfExperience;
      doctor.aboutMe = req.body.aboutMe;
      doctor.profileCompleted = !!(req.body.specialization && req.body.yearsOfExperience && req.body.aboutMe);
      console.log("Updated existing doctor profile:", doctor);
    }

    const savedDoctor = await doctor.save();
    console.log("Saved doctor profile:", savedDoctor);

    res.status(200).json({
      message: "Profile updated successfully",
      updatedDoctor: savedDoctor
    });

  } catch (error) {
    console.error("Detailed error in updateProfile:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({
      success: true,
      data: doctors,
      count: doctors.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      data: null,
      count: 0
    });
  }
};

module.exports = {
  getProfile,
  getAllDoctors,
  updateProfile
};
