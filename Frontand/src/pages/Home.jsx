import React from "react";
import { useNavigate } from "react-router-dom";  // <-- yeh import karo
import Navbar from "../components/Navbar";
import partners from "../data/partners.json";
import "../styles/Home.css"

export default function Home() {
  const heroUrl =
    "https://images.pexels.com/photos/758898/pexels-photo-758898.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    if (token && currentUser) {
      navigate("/main"); // ✅ agar login hai to profile/main page par
    } else {
      navigate("/login");   // ❌ agar login nahi hai to login page par
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <header
        className="hero"
        style={{ backgroundImage: `url("${heroUrl}")` }}
        role="banner"
      >
        <div className="hero-content">
          <h1>MatchMe — Find your perfect partner</h1>
          <p>
            Simple, fast, and easy matchmaking. Create your profile to get
            started.
          </p>
          <button className="cta" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </header>

      {/* About Section */}
      <section className="about" id="about">
        <h2>About MatchMe</h2>
        <p>
          MatchMe helps you discover compatible partners with simple filters and
          easy-to-create profiles.
        </p>
      </section>

      {/* Partners Section */}
      <section className="partners-row" id="partners">
        <h3>Featured Partners</h3>
        <div className="partners-list">
          {partners.slice(0, 5).map((p) => {
            const imgSrc =
              typeof p.image === "string" && p.image.startsWith("http")
                ? p.image
                : `/images/${p.image}`;
            return (
              <div className="partner-card" key={p.id}>
                <img src={imgSrc} alt={p.name} loading="lazy" />
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

      {/* Footer */}
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} MatchMe</p>
        <nav>
          <h5>made by devendra❤️</h5>
        </nav>
      </footer>
    </>
  );
}
