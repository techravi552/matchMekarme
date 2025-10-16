import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/users/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");

      if (res.data.userProfile) {
        localStorage.setItem("currentUser", JSON.stringify(res.data.Profile[0]));
        navigate("/main");
      } else {
        navigate("/profile-setup");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials!");
    }
  };

  // 👇 Navigate to Signup Page
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="auth-form">
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
        <button type="submit" className="btn primary">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <b
            style={{ cursor: "pointer", color: "var(--primary)" }}
            onClick={goToSignup}
          >
            Sign up
          </b>
        </p>
    
      </form>
    </div>
  );
}
