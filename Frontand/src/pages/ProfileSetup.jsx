// src/components/ProfileForm.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ProfileForm.css";
import Navbar from "../components/Navbar";

export default function ProfileForm({ existingProfile }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    number: "",
    gender: "",
    shortBio: "",
    age: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Step 1: Auto-fill email from localStorage and check if profile exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");

    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));

      // ✅ Step 2: Check from API if profile exists
      const checkProfile = async () => {
        try {
          const res = await fetch(`https://matchmekarme.onrender.com/api/profiles/email/${savedEmail}`);
          if (res.ok) {
            const data = await res.json();

            if (data && data.email) {
              // Profile already exists → go to main page
              navigate("/mainPage");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking profile:", error);
        } finally {
          setLoading(false);
        }
      };

      checkProfile();
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // ✅ Step 3: Fill existing profile if passed
  useEffect(() => {
    if (existingProfile) {
      setForm({ ...existingProfile, profileImage: null });
    }
  }, [existingProfile]);

  // ✅ Step 4: Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  // ✅ Step 5: Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = await fetch("https://matchmekarme.onrender.com/api/profiles", {
        method: existingProfile ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save profile");

      const data = await response.json();
      alert("✅ Profile saved successfully!");
      console.log("Profile response:", data);

      // ✅ After save, go to main page
      navigate("/mainPage");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ Something went wrong while saving profile!");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Checking your profile...</p>;
  }

  // ✅ Step 6: Render form
  return (
   <>
    <Navbar/>
 
    <div className="profile-form-container">
      <h2 className="form-title">
        {existingProfile ? "Update Your Profile" : "Create Your Profile"}
      </h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}   readOnly  required />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input type="text" name="number" placeholder="Mobile Number" value={form.number} onChange={handleChange} required />

        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <textarea
          name="shortBio"
          placeholder="Short Bio (max 20 words)"
          value={form.shortBio}
          onChange={handleChange}
          required
        />

        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />

        <input type="file" name="profileImage" accept="image/*" onChange={handleChange} />

        <button type="submit" className="submit-btn">
          {existingProfile ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
      </>
  );
}
