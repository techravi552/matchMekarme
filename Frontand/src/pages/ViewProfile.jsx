import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/ViewProfile.css";

export default function ViewProfile() {
  const { id } = useParams(); // user ID from route
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://matchmekarme.onrender.com/api/profiles/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading profile...</p>;

  const profileImageUrl = profile.profileImage
    ? profile.profileImage.startsWith("http")
      ? profile.profileImage
      : `https://matchmekarme.onrender.com/uploads/${profile.profileImage}`
    : "https://via.placeholder.com/250";

  return (
    <>
      <Navbar />

      <div className="view-profile-container">
        <div className="profile-card-view">
          {/* Top section: image + name/age */}
          <div className="profile-top">
            <img src={profileImageUrl} alt={profile.name} className="profile-image" />
            <div className="profile-basic">
              <h1>{profile.name}</h1>
              <p>Age - {profile.age} Year</p>
              <p>City - {profile.city}</p>
            </div>
          </div>

          {/* Info section */}
          <div className="profile-info-section">
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Mobile:</strong> {profile.number}</p>
            <p><strong>Bio:</strong> {profile.shortBio}</p>
          </div>

          {/* Action buttons */}
          <div className="profile-action-buttons">
            <button className="like-btn">❤️ Like</button>
            <button className="follow-btn">➕ Follow</button>
          </div>

          {/* Chat button */}
          <div className="chat-button-section">
            <button className="chat-btn">💬 Chat</button>
          </div>
        </div>
      </div>
    </>
  );
}
