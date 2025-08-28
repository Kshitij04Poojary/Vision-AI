import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle, User } from "lucide-react";
import { BACKEND_URL } from "@/constant";

const UserBookings = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/bookings/user/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      setBookings(data.data);
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupBookingsByDate = () => {
    return bookings.reduce((acc, booking) => {
      const dateKey = format(new Date(booking.date), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(booking);
      return acc;
    }, {});
  };

  const getStatusColor = (status) => {
    const statusColors = {
      confirmed: "bg-green-500 text-white",
      cancelled: "bg-red-500 text-white",
      pending: "bg-gray-500 text-white",
    };
    return statusColors[status.toLowerCase()] || "bg-gray-500 text-white";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl ml-16 p-6 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
        <AlertCircle className="h-6 w-6" />
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  const groupedBookings = groupBookingsByDate();

  return (
    <div className="w-full max-w-7xl ml-16 p-6">
      {Object.entries(groupedBookings).length > 0 ? (
        Object.entries(groupedBookings).map(([date, dayBookings]) => (
          <div key={date} className="mb-12 last:mb-0">
            <div className="flex items-center gap-3 mb-6 text-gray-700">
              <Calendar className="h-7 w-7 text-blue-500" />
              <h3 className="text-2xl font-semibold">
                {format(new Date(date), "MMMM d, yyyy")}
              </h3>
            </div>

            <div className="space-y-6">
              {dayBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-blue-500" />
                        <span className="font-medium text-xl text-gray-900">
                          {booking.timeSlot}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="h-6 w-6 text-gray-400" />
                        <span className="text-lg text-gray-600">
                          <span className="font-medium">
                            {user.role === "Doctor" ? "Patient: " : "Doctor: "}
                          </span>
                          {booking.otherUser.name}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-6 py-2 rounded-full text-lg font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <p className="text-xl text-gray-500">
            No upcoming {user.role === "Doctor" ? "appointments" : "bookings"}{" "}
            found
          </p>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
