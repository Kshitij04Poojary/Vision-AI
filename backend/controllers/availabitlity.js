const Availability = require("../models/availability");
const User = require("../models/userModels"); // Correct capitalization for consistency
const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");

const availabilityController = {
    // Get availability for a specific date

   getAvailableTimeslots : async (req, res) => {
    try {
        const { doctorId, date } = req.params;

        // Validate date format
        const parsedDate = new Date(date);
        if (!date || isNaN(parsedDate)) {
            return res.status(400).json({
                success: false,
                error: "Invalid date format"
            });
        }

        // Convert doctorId to ObjectId
        const doctorObjectId = new ObjectId(doctorId);

        // Get doctor's availability for the date
        const availability = await Availability.findOne({
            doctorId: doctorObjectId, // Ensure it's ObjectId
            date: parsedDate
        });

        if (!availability) {
            return res.json({
                success: true,
                data: {
                    timeSlots: []
                }
            });
        }

        res.json({
            success: true,
            data: {
                timeSlots: availability.timeSlots
            }
        });

    } catch (error) {
        console.error("Error fetching available timeslots:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch available timeslots"
        });
    }
},

    // Save availability for a date
    saveAvailability: async (req, res) => {
        try {
            if (!req.user || req.user.role !== "Doctor") {
                return res.status(403).json({ 
                    success: false, 
                    error: "Unauthorized access" 
                });
            }

            const { date, timeSlots } = req.body;
            const doctorId = req.user._id;

            if (!date || isNaN(new Date(date))) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Invalid date format" 
                });
            }

            // Validate time slots
            if (!Array.isArray(timeSlots) || timeSlots.some(slot => typeof slot !== "number" || slot < 1 || slot > 9)) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Invalid time slots provided" 
                });
            }

            const availability = await Availability.findOneAndUpdate(
                { doctorId, date: new Date(date) },
                {
                    $set: {
                        timeSlots: [...new Set(timeSlots)], // Remove duplicates
                        updatedAt: new Date()
                    }
                },
                { upsert: true, new: true }
            );

            // Fetch doctor's name
            const doctor = await User.findById(doctorId).select("name");

            res.json({ 
                success: true, 
                message: "Availability saved successfully", 
                data: {
                    doctorName: doctor ? doctor.name : "Unknown",
                    availability
                }
            });

        } catch (error) {
            console.error("Error saving availability:", error);
            res.status(500).json({ 
                success: false, 
                error: "Failed to save availability" 
            });
        }
    }
};

module.exports = availabilityController;
