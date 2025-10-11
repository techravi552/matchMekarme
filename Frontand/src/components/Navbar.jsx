import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/40");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get("https://matchmekarme.onrender.com/api/profiles");
          const profile = res.data.find(p => p.email === user.email);

          if (profile) {
            const imgUrl = profile.profileImage.startsWith("http")
              ? profile.profileImage
              : `https://matchmekarme.onrender.com/uploads/${profile.profileImage}`;
            setProfileImage(imgUrl);
            setUserName(profile.name); // ✅ Name bhi wahi se set
            setCurrentUserProfile(profile);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUserProfile(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">💑 MatchMaker</h1>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        {currentUserProfile ? (
          <>
            <img src={profileImage} alt="dp" className="nav-dp" />
            <span>{userName}</span> {/* ✅ Name API se */}
              <button onClick={() => navigate("/myprofile")} className="btn">
    My Profile
  </button>

            <button onClick={handleLogout} className="btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="btn">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="btn">
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
