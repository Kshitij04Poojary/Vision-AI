import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import Cookies from "js-cookie";
import "react-calendar/dist/Calendar.css";
import { UserContext } from "../context/userContext";
import { BACKEND_URL } from "@/constant";

const DoctorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const { user } = useContext(UserContext);

  const timeSlots = [
    { id: 1, time: "9:00-10:00" },
    { id: 2, time: "10:00-11:00" },
    { id: 3, time: "11:00-12:00" },
    { id: 4, time: "12:00-13:00" },
    { id: 5, time: "14:00-15:00" },
    { id: 6, time: "15:00-16:00" },
    { id: 7, time: "16:00-17:00" },
    { id: 8, time: "17:00-18:00" },
    { id: 9, time: "18:00-19:00" },
  ];
  const formatDate = (date) => {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
  };

  const fetchDoctorId = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication token not found");

      const email = user.email;
      const response = await fetch(
        `${BACKEND_URL}/v1/user/doctor-id/${email}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch doctor ID");

      const data = await response.json();
      console.log("Doctor ObjectId:", data.doctorId);

      setDoctorId(data.doctorId);
    } catch (error) {
      console.error("Error fetching doctor ID:", error);
    }
  };
  useEffect(() => {
    fetchDoctorId();
  }, []);

  const handleSave = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Slots:", selectedSlots);
    console.log(formatDate(selectedDate));

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${BACKEND_URL}/doctor`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          date: formatDate(selectedDate),
          timeSlots: selectedSlots,
        }),
      });

      if (response.ok) {
        setSaveStatus({
          type: "success",
          message: "Availability saved successfully",
        });
      } else {
        throw new Error("Failed to save availability");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      setSaveStatus({ type: "error", message: "Failed to save availability" });
    } finally {
      setSelectedSlots([]);
    }
  };

  const handleSlotToggle = (slotId) => {
    setSelectedSlots((prev) => {
      const updatedSlots = prev.includes(slotId)
        ? prev.filter((id) => id !== slotId) // Remove if already selected
        : [...prev, slotId]; // Add if not selected

      return updatedSlots;
    });
  };

  const clearSelection = () => {
    setSelectedSlots([]);
    setSaveStatus({ type: "success" });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlots([]); // Reset selected slots on date change
    setSaveStatus({ type: "", message: "" }); // Clear previous messages
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Doctor Availability Schedule</h1>
          <p className="text-blue-100">Select your available time slots</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 p-8">
          <div className="md:w-2/5">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select Date
              </h2>
              <div className="calendar-container">
                <style>
                  {`
                      .calendar-container .react-calendar {
                        width: 100%;
                        border: none;
                        font-family: inherit;
                      }
                      .react-calendar__tile {
                        padding: 1em 0.5em;
                        height: 3rem;
                        font-size: 0.875rem;
                        position: relative;
                      }
                      .react-calendar__tile:enabled:hover,
                      .react-calendar__tile:enabled:focus {
                        background-color: #f3f4f6;
                        border-radius: 8px;
                      }
                      .react-calendar__tile--active {
                        background-color: #2563eb !important;
                        border-radius: 8px;
                      }
                      .react-calendar__tile--now {
                        background-color: #dbeafe;
                        border-radius: 8px;
                      }
                      .react-calendar__navigation {
                        margin-bottom: 1rem;
                      }
                      .react-calendar__navigation button {
                        font-size: 1rem;
                        padding: 0.5rem;
                        background: none;
                        border-radius: 8px;
                      }
                      .react-calendar__navigation button:enabled:hover,
                      .react-calendar__navigation button:enabled:focus {
                        background-color: #f3f4f6;
                      }
                      .react-calendar__month-view__weekdays {
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: #4b5563;
                        text-transform: uppercase;
                        margin-bottom: 0.5rem;
                      }
                      .react-calendar__month-view__days__day--weekend {
                        color: #ef4444;
                      }
                      .react-calendar__month-view__days__day--neighboringMonth {
                        color: #9ca3af;
                      }
                    `}
                </style>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  className="w-full border-0"
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">
                  Selected date:{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-3/5">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Available Time Slots
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotToggle(slot.id)}
                    className={`
                        relative p-4 rounded-lg font-medium transition-all duration-200
                        ${
                          selectedSlots.includes(slot.id)
                            ? "bg-blue-600 text-white shadow-md transform scale-105"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }
                      `}
                  >
                    <span className="block text-sm">{slot.time}</span>
                    {selectedSlots.includes(slot.id) && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save Availability
                </button>
                <button
                  onClick={clearSelection}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Clear Selection
                </button>
              </div>

              {saveStatus.message && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    saveStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <p className="text-sm font-medium">{saveStatus.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
