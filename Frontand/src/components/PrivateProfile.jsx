import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const PrivateProfile = ({ children }) => {
  const [checking, setChecking] = useState(true); // ✅ to wait until API check completes
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const verifyProfile = async () => {
      if (!token) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        const res = await axios.get("https://matchmekarme.onrender.com/api/profiles");
        const existingUser = res.data.find(
          (profile) => profile.email === email
        );

        if (existingUser) {
          // ✅ अगर profile पहले से मौजूद है → mainPage पर भेज दो
          navigate("/mainPage");
        } else {
          // ⚠️ profile नहीं है → profileSetup पर रखो
          navigate("/profileSetup");
        }

        setAuthorized(true);
      } catch (err) {
        console.error("Profile check error:", err);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyProfile();
  }, [token, email, navigate]);

  // ⏳ जब तक check हो रहा है तब तक कुछ भी render न करो
  if (checking) return <div>Checking profile...</div>;

  // ❌ अगर token नहीं है → login पर redirect
  if (!authorized && !token) return <Navigate to="/login" />;

  // ✅ authorized होने पर children दिखाओ
  return children;
};

export default PrivateProfile;
