import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ useEffect ke andar hi parse karo
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setForm(currentUser);
    }
  }, []); // ✅ Empty dependency - sirf ek baar chalega

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // ✅ Yahan bhi fresh parse karo
    
    try {
      const res = await axios.put(
        `https://matchmakerproject.onrender.com/profile/update/${currentUser._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile Updated ✅");

      // update frontend storage
      localStorage.setItem("currentUser", JSON.stringify(res.data));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
  };

  return (
    <div className="form-page">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name || ""}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={form.gender || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bio"
          placeholder="Bio"
          value={form.bio || ""}
          onChange={handleChange}
        />   
        <button type="submit" className="btn primary">
          Save Changes
        </button>
        <button 
          type="button" 
          onClick={() => navigate("/profile")} 
          className="btn primary"
        > 
          Back
        </button>
      </form>
    </div>
  );
}