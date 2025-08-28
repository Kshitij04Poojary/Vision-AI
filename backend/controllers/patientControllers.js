const path = require("path");
const fs = require("fs");
const Patient = require("../models/patientDetails");

const patientController = {
  createPatient: async (req, res, next) => {
    try {
      const {
        name,
        age,
        gender,
        bloodGroup,
        leftEyePrediction,
        rightEyePrediction,
        leftEyeHRPrediction,
        rightEyeHRPrediction
      } = req.body;

      // ✅ Ensure required fields are present
      if (
        !name ||
        !age ||
        !gender ||
        !bloodGroup ||
        !leftEyePrediction ||
        !rightEyePrediction
      ) {
        console.log("we are here");
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }
      // ✅ No need to check for req.body.patientData
      const patientData = { ...req.body };

      // ✅ Attach file paths if images are uploaded
      if (req.files) {
        if (req.files.leftEyeImage) {
          patientData.leftEyeImage = {
            path: req.files.leftEyeImage[0].path,
            originalName: req.files.leftEyeImage[0].originalname,
            mimetype: req.files.leftEyeImage[0].mimetype,
          };
        }
        if (req.files.rightEyeImage) {
          patientData.rightEyeImage = {
            path: req.files.rightEyeImage[0].path,
            originalName: req.files.rightEyeImage[0].originalname,
            mimetype: req.files.rightEyeImage[0].mimetype,
          };
        }
      }

      // ✅ Save to MongoDB
      const patient = new Patient(patientData);
      await patient.save();

      res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        data: patient,
      });
    } catch (error) {
      console.error("Error:", error);
      next(error);
    }
  },
  // Get all patients
  getAllPatients: async (req, res, next) => {
    try {
      const patients = await Patient.find();
      res.json({
        success: true,
        count: patients.length,
        data: patients,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single patient by ID

  getPatientById: async (req, res, next) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }
      const filenameLeft = patient.leftEyeImage.path
        .replace(/\\/g, "/")
        .split("/")
        .pop();
      const filenameRight = patient.rightEyeImage.path
        .replace(/\\/g, "/")
        .split("/")
        .pop();

      const leftEyeUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/fundus-images/${filenameLeft}`;
      const rightEyeUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/fundus-images/${filenameRight}`;

      res.json({
        success: true,
        data: {
          ...patient.toObject(),
          leftEyeImage: leftEyeUrl,
          rightEyeImage: rightEyeUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = patientController;
