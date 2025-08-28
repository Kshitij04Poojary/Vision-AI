const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
} = require("../controllers/patientControllers");
const upload = require("../middleware/upload");

router.post(
  "/",
  upload.fields([
    { name: "leftEyeImage", maxCount: 1 },
    { name: "rightEyeImage", maxCount: 1 },
  ]),
  createPatient
);

router.get("/", getAllPatients);
router.get("/:id", getPatientById);

module.exports = router;
