import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./../styles/Login.css";
import Navbar from "../components/Navbar";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://matchmekarme.onrender.com/api/auth/login", form);

      // ✅ Save token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/mainPage");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to continue your journey</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Signup here</Link>
        </p>
      </div>
    </div>
    </>
  );
}
