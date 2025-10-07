import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email"); // 👈 localStorage से email लो

    if (!email) {
      // अगर email ही नहीं है तो सीधा profile setup पर भेज दो
      navigate("/profileSetup");
      return;
    }

    // Backend से profiles लाओ
    fetch("http://localhost:5000/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        // check karo email exist karta hai ya nahi
        const found = data.find((p) => p.email === email);

        if (found) {
          navigate("/mainPage"); // agar profile mila to main.jsx par
        } else {
          navigate("/profileSetup"); // agar nahi mila to setup par
        }
      })
      .catch(() => {
        navigate("/profileSetup"); // error case me bhi setup
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Checking profile...</p>;

  return null; // kuch render nahi karega, bas redirect karega
}
