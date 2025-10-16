import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserDetails.css";

export default function UserDetails() {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${email}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [email]);

  if (loading) return <div className="loader">Loading profile...</div>;
  if (!profile) return <p className="not-found">Profile not found!</p>;

  return (
    <div className="details-wrapper">
      <div className="details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <div className="profile-card">
          <img
            src={profile.photo || "https://via.placeholder.com/150"}
            alt={profile.name}
            className="main-photo"
          />

          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>City:</strong> {profile.city}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
          </div>
        </div>

        {profile.gallery && profile.gallery.length > 0 && (
          <div className="gallery-section">
            <h3>Gallery Photos 📸</h3>
            <div className="gallery-grid">
              {profile.gallery.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Gallery ${index}`}
                  className="gallery-photo"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
