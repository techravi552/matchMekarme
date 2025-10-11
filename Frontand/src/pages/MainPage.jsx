import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/MainPage.css";

export default function MainPage() {
   const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("https://matchmekarme.onrender.com/api/profiles");

        // ✅ Find current user's full profile
       const mainProfile = res.data.find(profile => profile.email === userEmail);
console.log(mainProfile)
 localStorage.setItem("currentProfile", JSON.stringify(mainProfile));
// Build proper image URL



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
     <Navbar/>

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
                  : `https://matchmekarme.onrender.com/uploads/${user.profileImage}`
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
                 <button
                  className="view-btn"
                  onClick={() => navigate(`/viewProfile/${user._id}`)}
                >
                  👁 View Details
                </button>
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
