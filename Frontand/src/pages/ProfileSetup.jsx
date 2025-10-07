import React, { useState, useEffect } from "react";
import "./ProfileForm.css"; // custom CSS

export default function ProfileForm({ existingProfile }) {
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

  useEffect(() => {
    if (existingProfile) {
      setForm({ ...existingProfile, profileImage: null });
    }
  }, [existingProfile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:5000/api/profiles", {
        method: existingProfile ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();
      alert("✅ Profile saved successfully!");
      console.log("Profile response:", data);
      

    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ Something went wrong while saving profile!");
    }
  };

  return (
    <div className="profile-form-container">
      <h2 className="form-title">
        {existingProfile ? "Update Your Profile" : "Create Your Profile"}
      </h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input type="text" name="number" placeholder="Mobile Number" value={form.number} onChange={handleChange} required />

        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <textarea name="shortBio" placeholder="Short Bio (max 20 words)" value={form.shortBio} onChange={handleChange} required />

        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />

        <input type="file" name="profileImage" accept="image/*" onChange={handleChange} />

        <button type="submit" className="submit-btn">
          {existingProfile ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
