import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import Cookies from "js-cookie";
import { UserCircle } from "lucide-react";
import { BACKEND_URL } from "@/constant";

const DoctorProfile = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    yearsOfExperience: "",
    aboutMe: "",
    profileCompleted: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchDoctorProfile = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication token not found");

      const email = user.email;

      // Modified to fetch from the doctor endpoint instead of user endpoint
      const response = await fetch(`${BACKEND_URL}/mydoctor/profile/${email}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const doctorData = await response.json();

      // Update form with doctor profile data
      setFormData({
        name: doctorData.name || "",
        email: doctorData.email || "",
        specialization: doctorData.specialization || "",
        yearsOfExperience: doctorData.yearsOfExperience || "",
        aboutMe: doctorData.aboutMe || "",
        profileCompleted: doctorData.profileCompleted || false,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch doctor information");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchDoctorProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication token not found");

      // Log the request details for debugging
      console.log("Sending update request for email:", user.email);
      console.log("Request body:", {
        specialization: formData.specialization,
        yearsOfExperience: formData.yearsOfExperience,
        aboutMe: formData.aboutMe,
      });

      const response = await fetch(
        `${BACKEND_URL}/mydoctor/profile/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            specialization: formData.specialization,
            yearsOfExperience: formData.yearsOfExperience,
            aboutMe: formData.aboutMe,
          }),
        }
      );

      // Log the response status for debugging
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      console.log("Success response:", data);

      // Update form data with the response from the server
      setFormData((prevData) => ({
        ...prevData,
        specialization: data.updatedDoctor.specialization,
        yearsOfExperience: data.updatedDoctor.yearsOfExperience,
        aboutMe: data.updatedDoctor.aboutMe,
        profileCompleted: data.updatedDoctor.profileCompleted,
      }));

      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || "Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 px-8 py-12 text-center">
            <div className="mb-4 flex justify-center">
              <UserCircle className="w-32 h-32 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {formData.name}
            </h1>
            <p className="text-blue-100">{formData.email}</p>
          </div>

          {/* Profile Completion Status */}
          {!formData.profileCompleted && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please complete your profile to access all features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-8">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Specialization
                  </h3>
                  <p className="text-gray-600">
                    {formData.specialization || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </h3>
                  <p className="text-gray-600">
                    {formData.yearsOfExperience || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    About Me
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {formData.aboutMe || "Not specified"}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your specialization"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter years of experience"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    About Me
                  </label>
                  <textarea
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself and your practice"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    {success}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
