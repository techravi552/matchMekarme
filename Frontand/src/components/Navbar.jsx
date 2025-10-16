import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"

export default function Navbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
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
              src={currentUser.photo || "https://via.placeholder.com/40"}
              alt="dp"
              className="nav-dp"
            />
            <span>{currentUser.name}</span>
            <button onClick={() => navigate("/profile")} className="btn">
              Your Profile
            </button>
            <Link to="/notifications">
              <button>🔔</button>
            </Link>
            <Link to="/messages">
              <button>💌 </button>
            </Link>
            <Link to="/main">
            
            <button className="btn">mainPage</button>

            </Link>
            <button onClick={handleLogout} className="btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="btn">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="btn primary">
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
