const Booking = require('../models/scheduling');
const User = require('../models/userModels');
const mongoose = require('mongoose')
const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    // Validate the date parameter
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format'
      });
    }

    // Ensure date is in YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Create start and end of day dates
    const startDate = new Date(formattedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedDate);
    endDate.setHours(23, 59, 59, 999);

    // Validate doctorId
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }

    // Find all confirmed bookings for the specified doctor and date
    const bookings = await Booking.find({
      doctorId,
      date: {
        $gte: startDate,
        $lte: endDate
      },
      status: 'confirmed'
    });

    // Time slot mapping
    const timeSlotMap = {
      '9:00-10:00': 1,
      '10:00-11:00': 2,
      '11:00-12:00': 3,
      '12:00-13:00': 4,
      '14:00-15:00': 5,
      '15:00-16:00': 6,
      '16:00-17:00': 7,
      '17:00-18:00': 8,
      '18:00-19:00': 9
    };

    // Extract and map the booked slots
    const bookedSlots = bookings
      .map(booking => timeSlotMap[booking.timeSlot])
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      bookedSlots,
      date: formattedDate
    });

  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching booked slots',
      error: error.message
    });
  }
};
// const getBookedSlots = async (req, res) => {
//   try {
//     const { doctorId, date } = req.params;

//     // Convert the date string to start and end of the day
//     const startDate = new Date(date);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(date);
//     endDate.setHours(23, 59, 59, 999);

//     // Find all confirmed bookings for the specified doctor and date
//     const bookings = await Booking.find({
//       doctorId,
//       date: {
//         $gte: startDate,
//         $lte: endDate
//       },
//       status: 'confirmed'
//     });

//     // Extract the timeSlots and map them to slot IDs
//     const bookedSlots = bookings.map(booking => {
//       // Convert time slot string (e.g., "9:00-10:00") to slot ID (1-9)
//       const timeSlotMap = {
//         '9:00-10:00': 1,
//         '10:00-11:00': 2,
//         '11:00-12:00': 3,
//         '12:00-13:00': 4,
//         '14:00-15:00': 5,
//         '15:00-16:00': 6,
//         '16:00-17:00': 7,
//         '17:00-18:00': 8,
//         '18:00-19:00': 9
//       };

//       return timeSlotMap[booking.timeSlot];
//     }).filter(Boolean); // Remove any undefined values

//     return res.status(200).json({
//       success: true,
//       bookedSlots
//     });

//   } catch (error) {
//     console.error('Error fetching booked slots:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error fetching booked slots',
//       error: error.message
//     });
//   }
// };

// Create a new booking
const createBooking = async (req, res) => {
  try {
    let { doctorId, patientId, date, timeSlot } = req.body;

    // Convert date to "YYYY-MM-DD" before storing (remove time component)
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({
      doctorId,
      date: formattedDate,  // Compare with formatted date
      timeSlot,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create new booking
    const booking = new Booking({
      doctorId,
      patientId,
      date: formattedDate, // Save formatted date
      timeSlot,
      status: 'confirmed'
    });

    await booking.save();

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};


const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch bookings where the user is either a doctor or a patient
    const bookings = await Booking.find({
      $or: [{ doctorId: userId }, { patientId: userId }]
    })
      .populate('doctorId', 'name email')  // Populate doctor details
      .populate('patientId', 'name email') // Populate patient details
      .sort({ date: 1, timeSlot: 1 });


    // If no bookings found, return empty array
    if (!bookings.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Format the bookings response
    const formattedBookings = bookings.map(booking => {
      const isPatient = booking.patientId._id.toString() === userId.toString();

      return {
        id: booking._id,
        date: booking.date.toISOString().split('T')[0], // Date should already be stored as "YYYY-MM-DD"
        timeSlot: booking.timeSlot,
        status: booking.status,
        otherUser: {
          name: isPatient ? booking.doctorId.name : booking.patientId.name,
          email: isPatient ? booking.doctorId.email : booking.patientId.email
        }
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedBookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);

    return res.status(500).json({
      success: false,
      message: 'Error fetching booked slots',
      error: error.message
    });
  }
};

module.exports = {
  getBookedSlots,
  createBooking,
  getUserBookings
};