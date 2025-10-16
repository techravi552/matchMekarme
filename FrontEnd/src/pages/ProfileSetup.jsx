import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileSetup.css"


export default function ProfileSetup() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    age: currentUser?.age || "",
    gender: currentUser?.gender || "",
    city: currentUser?.city || "",
    bio: currentUser?.bio || "",
    photo: currentUser?.photo || ""
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File size check (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    
    setPhotoFile(file);
    
    // Preview ke liye
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('age', form.age);
    formData.append('gender', form.gender);
    formData.append('city', form.city);
    formData.append('bio', form.bio);
    
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      const response = await fetch('http://localhost:5000/profile/create', {
        method: 'POST',
        body: formData
        // ❌ NO headers - browser automatically sets Content-Type
      });

      const data = await response.json();
      
      if (response.ok) {
        const updatedUser = {
          ...currentUser,
          ...data.profile
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        
        alert("Profile saved successfully!");
        navigate("/main");
    
      } else {
        alert(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Profile Setup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          value={form.age}
          placeholder="Age"
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="city"
          value={form.city}
          placeholder="City"
          onChange={handleChange}
          required
        />
        <textarea
          name="bio"
          value={form.bio}
          placeholder="Short Bio"
          onChange={handleChange}
          required
        />
        <label>Upload Photo:</label>
        <input type="file" accept="image/*" onChange={handlePhoto} />
        {form.photo && (
          <img
            src={form.photo}
            alt="Preview"
            style={{ width: "100px", marginTop: "10px", borderRadius: "50%" }}
          />
        )}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}