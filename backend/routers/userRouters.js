const express = require("express");
const {
  createUser,
  loginUser,
  getUserDetails,
  getDoctors,
  getDoctorId,
  getPatientId
} = require("../controllers/userControllers");
const isAuthenticated = require("../middleware/authentication");

const userRouter = express.Router();
userRouter.post("/",createUser)

userRouter.post("/login", loginUser);
userRouter.get("/doctors", isAuthenticated, getDoctors); 
userRouter.get("/", isAuthenticated, getUserDetails);
userRouter.get("/doctor-id/:email", getDoctorId);
userRouter.get("/patient-id/:email", getPatientId);
module.exports = userRouter;
