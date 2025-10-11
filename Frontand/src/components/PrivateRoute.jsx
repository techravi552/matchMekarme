// ✅ PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // 🔹 Agar token nahi hai → login par bhej do
    if (!token) {
      navigate("/login");
      return;
    }

    // 🔹 Agar email nahi hai → profile setup par bhej do
    if (!email) {
      navigate("/profileSetup");
      return;
    }

    // 🔹 Backend se verify karo ki profile hai ya nahi
    fetch("https://matchmekarme.onrender.com/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.email === email);

        if (found) {
          // ✅ profile mili → allow
          setIsAllowed(true);
        } else {
          // ❌ profile nahi mili → setup par
          navigate("/profileSetup");
        }
      })
      .catch(() => navigate("/profileSetup"))
      .finally(() => setIsChecking(false));
  }, [navigate, token, email]);

  if (isChecking) return <p style={{ textAlign: "center" }}>Checking profile...</p>;

  return isAllowed ? children : null;
};

export default PrivateRoute;
