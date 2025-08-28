import React, { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  ArrowRight,
  Check,
  X,
  CheckCircle,
} from "lucide-react";
import { UserContext } from "../context/userContext";
import { BACKEND_URL } from "@/constant";

const DoctorsList = () => {
  const { user } = useContext(UserContext);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctorsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get token from storage
      const response = await fetch(`${BACKEND_URL}/mydoctor/getAllDoctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setDoctors(data.data);
      } else {
        setError("Failed to fetch doctors");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Modal Component
  const DoctorModal = ({ doctor, onClose }) => {
    const [showBooking, setShowBooking] = useState(false);

    if (!doctor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div
                  className={`w-24 h-24 rounded-full ${getAvatarColor(
                    doctor.name
                  )} flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {getInitials(doctor.name)}
                </div>
              </div>

              <div className="flex-grow">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {doctor.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {doctor.specialization}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {doctor.yearsOfExperience} years of experience
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {doctor.email}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2 text-gray-900">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold">About Me</h3>
                  </div>
                  <p className="text-gray-600">
                    {doctor.aboutMe ||
                      `Dr. ${doctor.name} is a highly qualified healthcare professional specializing in ${doctor.specialization} with ${doctor.yearsOfExperience} years of experience in providing exceptional patient care.`}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowBooking(true)}
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book an Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showBooking && (
          <BookingFlow doctor={doctor} onClose={() => setShowBooking(false)} />
        )}
      </div>
    );
  };

  const BookingFlow = ({ doctor, onClose }) => {
    const [activeTab, setActiveTab] = useState("date");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [doctorId, setDoctorId] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const timeSlotsList = [
      { id: 1, time: "9:00-10:00", period: "Morning" },
      { id: 2, time: "10:00-11:00", period: "Morning" },
      { id: 3, time: "11:00-12:00", period: "Morning" },
      { id: 4, time: "12:00-13:00", period: "Afternoon" },
      { id: 5, time: "14:00-15:00", period: "Afternoon" },
      { id: 6, time: "15:00-16:00", period: "Afternoon" },
      { id: 7, time: "16:00-17:00", period: "Evening" },
      { id: 8, time: "17:00-18:00", period: "Evening" },
      { id: 9, time: "18:00-19:00", period: "Evening" },
    ];

    useEffect(() => {
      fetchDoctorId();
      fetchPatientId();
    }, []);

    // Add polling for booked slots
    useEffect(() => {
      let intervalId;
      if (selectedDate && doctorId) {
        // Initial fetch
        fetchBookedSlots();
        // Poll every 30 seconds
        intervalId = setInterval(fetchBookedSlots, 30000);
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [selectedDate, doctorId]);

    const fetchDoctorId = async () => {
      try {
        const email = doctor.email;
        const response = await fetch(
          `${BACKEND_URL}/v1/user/doctor-id/${email}`
        );
        if (!response.ok) throw new Error("Failed to fetch doctor ID");
        const data = await response.json();
        setDoctorId(data.doctorId);
      } catch (err) {
        setError("Failed to fetch doctor information");
      }
    };

    const fetchPatientId = async () => {
      try {
        const email = user.email;
        const response = await fetch(
          `${BACKEND_URL}/v1/user/patient-id/${email}`
        );
        if (!response.ok) throw new Error("Failed to fetch patient ID");
        const data = await response.json();
        setPatientId(data.patientId);
      } catch (err) {
        setError("Failed to fetch patient information");
      }
    };

    // const fetchBookedSlots = async () => {
    //   try {
    //     const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    //     const response = await fetch(`http://localhost:3000/api/bookings/${doctorId}/${formattedDate}`);
    //     if (!response.ok) throw new Error("Failed to fetch booked slots");
    //     const data = await response.json();
    //     setBookedSlots(data.bookedSlots || []);

    //     // If selected slot is now booked, clear the selection
    //     if (selectedTimeSlot && data.bookedSlots.includes(selectedTimeSlot.id)) {
    //       setSelectedTimeSlot(null);
    //     }
    //   } catch (err) {
    //     console.error("Error fetching booked slots:", err);
    //   }
    // };

    const fetchBookedSlots = async () => {
      try {
        if (!selectedDate || !doctorId) return;

        // Log the incoming date for debugging
        console.log("Selected date before formatting:", selectedDate);

        // Ensure date is in YYYY-MM-DD format
        const formattedDate = new Date(selectedDate).toISOString().slice(0, 10);
        console.log("Formatted date:", formattedDate);

        const response = await fetch(
          `${BACKEND_URL}/bookings/${doctorId}/${formattedDate}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch booked slots");
        }

        const data = await response.json();
        setBookedSlots(data.bookedSlots || []);

        if (
          selectedTimeSlot &&
          data.bookedSlots.includes(selectedTimeSlot.id)
        ) {
          setSelectedTimeSlot(null);
        }
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setError(err.message);
      }
    };
    const fetchTimeSlots = async (date) => {
      if (!doctorId) {
        setError("Doctor information not available");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        const response = await fetch(
          `${BACKEND_URL}/doctor/${doctorId}/${formattedDate}`
        );
        const data = await response.json();

        if (data.success) {
          const availableSlots = timeSlotsList.filter(
            (slot) =>
              data.data.timeSlots.includes(slot.id) &&
              !bookedSlots.includes(slot.id)
          );
          setTimeSlots(availableSlots);
          setActiveTab("time");
        } else {
          setError("No available slots for selected date");
        }
      } catch (err) {
        setError("Failed to fetch time slots");
      } finally {
        setLoading(false);
      }
    };

    const handleDateSelect = (e) => {
      const date = e.target.value; // This should already be in YYYY-MM-DD format
      console.log("Selected date from input:", date);
      setSelectedDate(date);
      setSelectedTimeSlot(null);
      fetchTimeSlots(date);
    };
    const groupSlotsByPeriod = () => {
      return timeSlots.reduce((acc, slot) => {
        if (!acc[slot.period]) {
          acc[slot.period] = [];
        }
        acc[slot.period].push(slot);
        return acc;
      }, {});
    };

    const confirmBooking = async () => {
      if (!patientId) {
        setError("Patient information not available");
        return;
      }

      // Check if slot is still available before confirming
      if (bookedSlots.includes(selectedTimeSlot.id)) {
        setError(
          "This time slot has just been booked. Please select another slot."
        );
        setSelectedTimeSlot(null);
        fetchTimeSlots(selectedDate);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId,
            patientId,
            date: selectedDate,
            timeSlot: selectedTimeSlot.time,
          }),
        });

        if (!response.ok) throw new Error("Failed to confirm booking");

        const data = await response.json();
        setBookingConfirmed(true);
        // Immediately update booked slots after successful booking
        fetchBookedSlots();
      } catch (err) {
        setError("Failed to confirm booking");
      }
    };

    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxDateString = maxDate.toISOString().split("T")[0];

    const isSlotBooked = (slotId) => bookedSlots.includes(slotId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl">
          <div className="p-6">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Appointment with Dr. {doctor.name}
              </h2>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        activeTab === "date"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div
                      className={`h-1 w-16 mx-2 ${
                        activeTab === "time" ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        activeTab === "time"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection Tab */}
              {activeTab === "date" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    max={maxDateString}
                    value={selectedDate}
                    onChange={handleDateSelect}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Time Slots Tab */}
              {activeTab === "time" &&
                !loading &&
                !error &&
                !bookingConfirmed && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">
                        Available slots for{" "}
                        {format(new Date(selectedDate), "MMMM d, yyyy")}
                      </span>
                    </div>

                    {Object.entries(groupSlotsByPeriod()).map(
                      ([period, slots]) => (
                        <div key={period} className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-700">
                            {period}
                          </h3>
                          <div className="grid grid-cols-3 gap-3">
                            {slots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() =>
                                  !isSlotBooked(slot.id) &&
                                  setSelectedTimeSlot(slot)
                                }
                                disabled={isSlotBooked(slot.id)}
                                className={`relative px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                                  isSlotBooked(slot.id)
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : selectedTimeSlot?.id === slot.id
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {slot.time}
                                {isSlotBooked(slot.id) && (
                                  <span className="block text-xs mt-1 text-gray-400">
                                    Booked
                                  </span>
                                )}
                                {selectedTimeSlot?.id === slot.id && (
                                  <Check className="absolute top-1 right-1 w-4 h-4" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}

                    {timeSlots.length === 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center text-yellow-700">
                          <Calendar className="h-5 w-5 mr-2" />
                          No available slots for the selected date. Please
                          choose another date.
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={() => setActiveTab("date")}
                        className="px-4 py-2 text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Back to Date Selection
                      </button>
                      {selectedTimeSlot &&
                        !isSlotBooked(selectedTimeSlot.id) &&
                        timeSlots.length > 0 && (
                          <button
                            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                            onClick={confirmBooking}
                          >
                            <span>Confirm Booking</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  </div>
                )}

              {/* Booking Confirmed Message */}
              {bookingConfirmed && (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    Booking Done Successfully!
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Your appointment has been confirmed.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Medical Specialists
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Doctors List */}
        <div className="space-y-4">
          {currentDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 rounded-lg ${getAvatarColor(
                      doctor.name
                    )} flex items-center justify-center text-white font-bold text-xl shadow-sm`}
                  >
                    {getInitials(doctor.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-gray-800">
                      {doctor.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {doctor.yearsOfExperience} years experience
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-blue-600 font-medium">
                    {doctor.specialization}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}

        {/* Pagination */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? "bg-blue-500 text-white font-medium"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results Message */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
