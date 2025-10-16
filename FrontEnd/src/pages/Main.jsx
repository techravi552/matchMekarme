import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/Main.css";
import Footer from "../components/Footer";

export default function Main() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profile/all");
        let allUsers = res.data.profiles || [];
        // ✅ apni khud ki profile exclude karo
        allUsers = allUsers.filter((u) => u.email !== currentUser?.email);
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  




const handleLike = async (email) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/profile/like/${email}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { liked, match } = res.data;

    // ✅ Local UI update
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.email === email
          ? {
              ...u,
              likedBy: liked
                ? [...u.likedBy, currentUser.email]
                : u.likedBy.filter((e) => e !== currentUser.email),
            }
          : u
      )
    );

    // ✅ Match alert
    if (match) {
      alert("🎉 It's a Match! You both liked each other 💖");
    } else if (liked) {
      alert("You liked this profile ❤️");
    } else {
      alert("You unliked this profile 💔");
    }
  } catch (error) {
    console.error("Like error:", error);
    alert("Failed to toggle like!");
  }
};



  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.city?.toLowerCase().includes(search.toLowerCase()) ||
      u.gender?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar user={currentUser} />

      <div className="main-page">
        <h2>Find Your Match 💖</h2>

        <input
          type="text"
          placeholder="Search by name, city, gender"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <p>Loading profiles...</p>
        ) : (
          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              filteredUsers.map((u) => {
                const isLiked = u.likedBy?.includes(currentUser.email);
                return (
                  <div key={u.email} className="user-card">
                    <img
                      src={u.photo || "https://via.placeholder.com/150"}
                      alt={u.name}
                      className="user-photo"
                    />
                    <h3>
                      {u.name}, {u.age}
                    </h3>
                    <p>{u.city}</p>
                    <p>{u.bio}</p>
                    <p>Likes ❤️ </p>
                    <div className="card-actions">
                      <button
                        className={`btn ${isLiked ? "liked" : ""}`}
                        onClick={() => handleLike(u.email)}
                      >
                        {isLiked ? "💔 Unlike" : "❤️ Like"}
                      </button>
                      <button
                        className="btn primary"
                        onClick={() => navigate(`/details/${u.email}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
