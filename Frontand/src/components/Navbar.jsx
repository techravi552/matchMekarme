import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar(props) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">💑 MatchMaker</h1>
      </div>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        {currentUser ? (
          <>
            <img
              src={props.dp || "https://via.placeholder.com/40"}
              alt="dp"
              className="nav-dp"
            />
            <span>{currentUser.name}</span>
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
              signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
