// src/pages/About.jsx
import React from "react";
import "../styles/About.css"

export default function About() {
  return (
    <section className="about-page">
      <div className="about-card">
        <header className="about-header">
          <h1>Find your perfect match with ease.</h1>
          <p className="subtitle">
            Simple, safe, and fun matchmaking for everyone.
          </p>
        </header>

        <div className="about-body">
          <article className="feature">
            <h2>What we offer</h2>
            <p>
              A friendly matchmaking platform that connects people based on
              interests, location and preferences — with an easy sign up and
              secure profile management.
            </p>
            <p className="hi">हम एक सरल और सुरक्षित matchmaking प्लेटफ़ॉर्म हैं जो रुचि, स्थान और पसंद के आधार पर लोगों को जोड़ता है।</p>
          </article>

          <article className="feature">
            <h3>User Essentials</h3>
            <ul>
              <li><strong>Login & Logout:</strong> Smooth authentication flow with token-based session management.</li>
              <li className="hi">लॉगिन और लॉगआउट: टोकन-आधारित session के साथ सरल authentication।</li>
              <li><strong>Profile with 5 Photos:</strong> Upload a profile photo plus up to five additional photos at once.</li>
              <li className="hi">प्रोफ़ाइल (5 तस्वीरें): एक प्रोफ़ाइल फोटो और एक ही बार में 5 अतिरिक्त फोटो अपलोड करें।</li>
              <li><strong>Edit & Update:</strong> Update name, city, gender and other profile details anytime.</li>
              <li className="hi">संपादन एवं अपडेट: नाम, शहर, जेंडर और अन्य विवरण कभी भी बदलें।</li>
            </ul>
          </article>

          <article className="feature">
            <h3>Interaction & Matchmaking</h3>
            <ul>
              <li><strong>Like System:</strong> Like a profile — if they like you back, it’s a mutual match and you get an instant alert.</li>
              <li className="hi">लाइक सिस्टम: अगर सामने वाले ने भी आपको लाइक किया तो mutual match बनता है और तुरंत अलर्ट आता है।</li>
              <li><strong>Real-time Alerts:</strong> Match alerts, messages and notifications powered by Redis and Socket.IO for instant delivery.</li>
              <li className="hi">रियल-टाइम अलर्ट: Redis और Socket.IO के जरिए तुरंत नोटिफ़िकेशन और मैसेज।</li>
              <li><strong>Group Chat:</strong> Redis-backed group chat for community conversations and event announcements.</li>
              <li className="hi">ग्रुप चैट: सामुदायिक बातचीत और घोषणा के लिए Redis आधारित ग्रुप चैट।</li>
            </ul>
          </article>

          <article className="feature">
            <h3>Smart Search & Filters</h3>
            <p>
              Browse and filter profiles by <strong>name</strong>, <strong>city</strong>, and <strong>gender</strong> to find matches that matter.
            </p>
            <p className="hi">नाम, शहर और जेंडर के आधार पर प्रोफ़ाइल फ़िल्टर करें और त्वरित रूप से उपयुक्त मैच खोजें।</p>
          </article>

          <article className="feature">
            <h3>Privacy & Safety</h3>
            <p>
              Your privacy is a priority — profile photos and personal data are handled securely. You control who sees your profile and photos.
            </p>
            <p className="hi">आपकी प्राइवेसी प्राथमिकता है — तस्वीरें और निजी डेटा सुरक्षित तरीके से संभाले जाते हैं। आप तय करते हैं कौन आपकी प्रोफ़ाइल देख सकेगा।</p>
          </article>

          <article className="feature extra">
            <h3>How it works (Quick Flow)</h3>
            <ol>
              <li>Sign up → Create profile with name, city, photo(s).</li>
              <li>Browse → Filter profiles by name/city/gender.</li>
              <li>Interact → Like profiles; mutual likes produce match alerts.</li>
              <li>Chat → Start one-to-one or join group chat (Socket.IO + Redis).</li>
            </ol>
            <p className="hi">साइनअप → ब्राउज़ → इंटरैक्ट → चैट (Socket.IO + Redis)</p>
          </article>
        </div>

        <footer className="about-footer">
          <div className="cta">
            <button className="btn primary" onClick={() => window.location.assign("/signup")}>
              Create Profile
            </button>
            <button className="btn outline" onClick={() => window.location.assign("/login")}>
              Login
            </button>
          </div>
          <p className="small-note">
            Built with MERN — optimized for speed, privacy and real-time interaction.
          </p>
        </footer>
      </div>
    </section>
  );
}
