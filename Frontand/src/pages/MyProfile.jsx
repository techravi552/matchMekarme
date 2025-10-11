import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyProfile.css";
import Navbar from "../components/Navbar";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://matchmekarme.onrender.com/api/profiles");
        const myProfile = res.data.find(p => p.email === user.email);
        setProfile(myProfile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.email]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!profile) return <p style={{ textAlign: "center" }}>Profile not found!</p>;

  const profileImage = profile.profileImage.startsWith("http")
    ? profile.profileImage
    : `https://matchmekarme.onrender.com/uploads/${profile.profileImage}`;

  return (
    <>
   <Navbar/>
    <div className="myprofile-container">
      <div className="myprofile-card">
        <img src={profileImage} alt={profile.name} className="myprofile-photo" />
        <h2>{profile.name}</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>City:</strong> {profile.city}</p>
        <p><strong>Number:</strong> {profile.number}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Age:</strong> {profile.age} yrs</p>
        <p><strong>Bio:</strong> {profile.shortBio}</p>
      </div>
    </div>
     </>
  );
}
