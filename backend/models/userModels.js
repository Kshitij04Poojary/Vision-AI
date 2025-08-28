const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email uniqueness
      trim: true, // Removes leading and trailing spaces
      lowercase: true, // Stores email in lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Minimum length should be 6"],
      select: false, // Excludes password from queries by default
    },
    role: {
      type: String,
      enum: ["Doctor", "Patient"], // Ensures only valid roles
      default: "Patient",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strictPopulate: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;