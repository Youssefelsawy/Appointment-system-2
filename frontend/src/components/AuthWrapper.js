// src/components/AuthWrapper.js
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthWrapper = ({ children, allowedRoles }) => {
  // 1. Check if token exists
  const token = localStorage.getItem("token");

  // 2. If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Decode token to check role
  let userRole;
  try {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // 4. Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 5. If all checks pass, render the protected component
  return children;
};

export default AuthWrapper;
