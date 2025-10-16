import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePafe.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
  }, []);

  // ✅ Handle file selection (5 limit)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload maximum 5 photos at a time!");
      e.target.value = "";
      return;
    }
    setSelectedFiles(files);
  };

  // ✅ Upload selected photos to backend (Cloudinary)
  const handleUploadPhotos = async () => {
    if (!selectedFiles.length) {
      alert("Please select at least one photo!");
      return;
    }

    if (user.gallery && user.gallery.length >= 5) {
      alert("You already have 5 photos in your gallery!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const uploadedGallery = [...(user.gallery || [])];

    try {
      for (let file of selectedFiles) {
        if (uploadedGallery.length >= 5) {
          alert("Gallery full! Max 5 photos allowed.");
          break;
        }

        const formData = new FormData();
        formData.append("photo", file);

        const res = await axios.post(
          `http://localhost:5000/profile/upload-photo/${user.email}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.gallery) {
          uploadedGallery.push(
            res.data.gallery[res.data.gallery.length - 1]
          );
        }
      }

      const updatedUser = { ...user, gallery: uploadedGallery };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSelectedFiles([]);
      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading photos!");
    } finally {
      setLoading(false);
    }
  };

//  👇 Navigate to Signup Page 
   const goToSignup = () => {
    navigate("/main");
  };

  return (
    <div className="profile-page">

    <p>
         
          <b
            style={{ cursor: "pointer", color: "var(--primary)" }}
            onClick={goToSignup}
          >
          Back
          </b>
        </p>
      
 

      <h2>Your Profile</h2>

      <div className="profile-card">
        <img
          src={user.photo || "https://via.placeholder.com/150"}
          alt="dp"
          className="profile-photo"
        />
        <h3>{user.name}</h3>
        <p>Age: {user.age}</p>
        <p>Gender: {user.gender}</p>
        <p>City: {user.city}</p>
        <p>Bio: {user.bio}</p>

        <button className="btn primary" onClick={() => navigate("/setup")}>
          Update Profile
        </button>
      </div>

      {/* 📸 Photo Gallery */}
      <div className="gallery-section">
        <h3>Your Photos</h3>
        <div className="gallery-grid">
          {user.gallery && user.gallery.length > 0 ? (
            user.gallery.map((photo, idx) => (
              <img key={idx} src={photo} alt="gallery" className="gallery-photo" />
            ))
          ) : (
            <p>No photos yet.</p>
          )}
        </div>

        {/* 🧩 Upload section */}
        <div className="gallery-add">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <button
            className="btn"
            onClick={handleUploadPhotos}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Photo(s)"}
          </button>
        </div>
      </div>
    </div>
  );
}
