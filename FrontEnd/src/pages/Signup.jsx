import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/users/signup", form);
    
    // backend से currentUser data आएगा
    localStorage.setItem("currentUser", JSON.stringify(res.data.user));

    alert("Signup successful!");
    // navigate("/profile-setup");
    navigate("/login")

  } catch (err) {
    alert(err.response?.data?.message || "Signup failed!");
  }
};


// 👇 Navigate to Login Page
  const gotoLogin = () => {
    navigate("/login");
  };


  return (
    <div className="form-page">
  
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Gmail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn primary">Signup</button>
        
<p>
  Already have an account?{" "}
  <b
    style={{ cursor: "pointer", color: "var(--primary)" }}
    onClick={gotoLogin}
  >
    Log in
  </b>
</p>

      </form>
    </div>
  );
}
