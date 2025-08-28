import { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import React from "react";
import "./App.css";
import { getUserDetails } from "./context/User/user";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { UserContext } from "./context/userContext";
import { Sidebar } from "./components/ui/Sidebar";
import MultiStepPatientForm from "./pages/MultiStepPatientForm";
import ConsultationRoom from "./pages/ConsultationRoom";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorsList from "./pages/DoctorsList";
import ProtectedRoute from "./ProtectedRoute";
import UserBookings from "./pages/PatientBooking";
import HealthMetricsProfile from "./pages/HealthPatient";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/Chatbot";
import AllPatientRecords from "./pages/AllPatientRecords";
function App() {
  const { setUser, user, setIsAuthen, setLoading, setError, loading } =
    useContext(UserContext);
  useEffect(() => {
    const checkCookiesAndDispatch = async () => {
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const userToken = cookies ? cookies.split("=")[1] : null;

      console.log("USER TOKEN: User Login Status:", userToken);

      if (userToken) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Restore user from storage
          setIsAuthen(true);
        } else {
          await getUserDetails(setIsAuthen, setUser, setLoading, setError);
        }
      }
      setLoading(false);
    };

    checkCookiesAndDispatch();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Persist user in storage
    }
  }, [user]);

  if (loading) return <div>Loading...</div>; // Avoid flicker

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        {user && <Sidebar />} {/* Show Sidebar only if user is logged in */}
         <Chatbot />
        
        <div className="flex-1 space-y-6 p-6 ">
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/patientform" element={<MultiStepPatientForm />} />
            <Route path="/all-patient-records" element={<AllPatientRecords />} />
            <Route
              path="/consultation"
              element={
                user ? (
                  <ConsultationRoom user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/userBookings" element={<UserBookings />} />
            <Route
              path="/doctorAvailability"
              element={<DoctorAvailability />}
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={<DoctorProfile />}
                  allowedRoles={["Doctor"]}
                />
              }
            />
            <Route
              path="/getAllDoctors"
              element={
                <ProtectedRoute
                  element={<DoctorsList />}
                  allowedRoles={["Patient"]}
                />
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute
                  element={<HealthMetricsProfile />}
                  allowedRoles={["Patient"]}
                />
              }
            />
       
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={<Dashboard />}
                  allowedRoles={["Doctor"]}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
