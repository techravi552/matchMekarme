import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/MainPage.css";

export default function MainPage() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentUserProfile, setCurrentUserProfile] = useState(null); // ✅ For Navbar
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profiles");

        // ✅ Find current user's full profile
       const mainProfile = res.data.find(profile => profile.email === userEmail);

// Build proper image URL
let currentUserImage = "https://via.placeholder.com/40";
if (mainProfile?.profileImage) {
  currentUserImage = mainProfile.profileImage.startsWith("http")
    ? mainProfile.profileImage
    : `http://localhost:5000/uploads/${mainProfile.profileImage}`;
}

setCurrentUserProfile({ ...mainProfile, profileImage: currentUserImage });


        // ✅ Filter out current user from profiles list
        const filteredProfiles = res.data.filter(profile => profile.email !== userEmail);
        setProfiles(filteredProfiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchProfiles();
  }, [userEmail]);

  // Filter profiles based on search input
  const filtered = profiles.filter(profile => {
    const term = search.toLowerCase();
    return (
      profile.name.toLowerCase().includes(term) ||
      profile.city.toLowerCase().includes(term) ||
      profile.age.toString().includes(term)
    );
  });

  return (
    <>
      {/* ✅ Pass current user profile image to Navbar */}
     <Navbar dp={currentUserProfile?.profileImage} />

      <div className="main-container">
        <h1 className="main-title">💑 Meet New People</h1>

        {/* Single search input */}
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by Name, Age, or City"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="profiles-grid">
          {filtered.length > 0 ? (
            filtered.map((user) => {
              const profileImageUrl = user.profileImage
                ? user.profileImage.startsWith("http")
                  ? user.profileImage
                  : `http://localhost:5000/uploads/${user.profileImage}`
                : "https://via.placeholder.com/200";

              return (
                <div className="profile-card" key={user._id}>
                  <img
                    src={profileImageUrl}
                    alt={user.name}
                    className="profile-photo"
                  />
                  <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p>{user.gender || "Not specified"}</p>
                    <p>{user.city}</p>
                    <p>{user.age} yrs</p>
                  </div>
                  <div className="profile-actions">
                    <button className="like-btn">❤️ Like</button>
                    <button className="view-btn">👁 View Details</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-data">No profiles found...</p>
          )}
        </div>
      </div>
    </>
  );
}
