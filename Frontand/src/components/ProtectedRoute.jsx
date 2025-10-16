// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Agar token nahi hai to /login par redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
