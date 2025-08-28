const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const createUser = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    if (!name || !email || !password) {
      return res.status(500).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(500).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user = await User.create({
      name,
      email,
      password: hashPass,
      role: role || 'Patient'
    });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error.message, " Error Message ", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "All Fields Are Required",
    });
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "User Doesn't Exist",
    });
  }

  const comparePass = await bcrypt.compare(password, user.password);

  if (!comparePass) {
    return res.status(500).json({
      success: false,
      message: "Password Doesn't Match",
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    success: true,
    message: "User Login Successfully",
    user,
    token,
  });
};

const generateToken = async (userID) => {
  const token = await jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const getUserDetails = async (req, res) => {
  try {
    const myId = req.user._id;

    const user = await User.findById(myId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(300).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" })
      .sort({ name: 1 });  // Sort by name alphabetically
    
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};
const getDoctorId = async (req, res) => {
  try {
    const { email } = req.params;

    const doctor = await User.findOne({ email, role: "Doctor" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ doctorId: doctor._id }); 
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPatientId = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the patient by email and role
    const patient = await User.findOne({ email, role: "Patient" });

    // If patient not found, return a 404 error
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Return the patient's ID
    res.json({ patientId: patient._id });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserDetails,
  getDoctors,
  getDoctorId,
  getPatientId
};
