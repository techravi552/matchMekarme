// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Notifications.css"

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(saved);
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-card">
        <h2 className="title">Notifications</h2>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet.</p>
            <p className="info">
              You’ll receive notifications here whenever the project owner shares updates
              or someone interacts with your profile.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n, index) => (
              <div key={index} className="notification-item">
                <p>{n.text}</p>
                {n.partnerId && (
                  <Link to={`/partner/${n.partnerId}`} className="view-btn">
                    View Profile
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate("/main")}>
          ⬅ Go to Main Page
        </button>
      </div>
    </div>
  );
}
