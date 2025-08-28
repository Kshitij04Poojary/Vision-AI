import React, { useContext } from "react";
import {  Navigate } from "react-router-dom";
import { UserContext } from "./context/userContext"; 

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(UserContext);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to home if not authorized
  }

  return element;
};


export default ProtectedRoute;
