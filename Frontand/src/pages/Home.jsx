import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import Navbar from "../components/Navbar";
import partnersData from "../data/partners.json";
import "../styles/Home.css";

export default function Home() {
  const [partners, setPartners] = useState([]);
  const navigate = useNavigate(); // 👈 For navigation

  const heroUrl =
    "https://images.pexels.com/photos/758898/pexels-photo-758898.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  useEffect(() => {
    setPartners(partnersData.slice(0, 5)); // sirf 5 partners
  }, []);

  // 👇 Function for Get Started button
  const handleGetStarted = () => {
    navigate("/mainPage");
  };

  return (
    <>
      <Navbar />

      <main className="hero" style={{ backgroundImage: `url("${heroUrl}")` }}>
        <div className="hero-content">
          <h1>MatchMe — Find your perfect partner</h1>
          <p>Simple, fast, and easy matchmaking. Create your profile to get started.</p>

          {/* 👇 Added onClick event */}
          <button className="cta" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </main>

      <section className="about">
        <h2>About MatchMe</h2>
        <p>
          MatchMe helps you discover compatible partners with simple filters and
          easy-to-create profiles.
        </p>
      </section>

      <section className="partners-row">
        <h3>Featured Partners</h3>
        <div className="partners-list">
          {partners.map((p) => {
            const imgSrc =
              typeof p.image === "string" && p.image.startsWith("http")
                ? p.image
                : `/images/${p.image}`;
            return (
              <div className="partner-card" key={p.id}>
                <img src={imgSrc} alt={p.name} />
                <div className="pc-info">
                  <strong>{p.name}</strong>
                  <div>
                    {p.gender} • {p.age}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="site-footer">
        <div>© {new Date().getFullYear()} MatchMe</div>
        <div>Help • Terms • Contact</div>
      </footer>
    </>
  );
}
