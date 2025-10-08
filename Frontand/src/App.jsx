// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";
import MainPage from "./pages/MainPage";
import PrivateRoute from "./components/PrivateRoute"; // 👈 IMPORT WAPAS KARO
import Home from "./pages/Home";
import PrivateProfile from "./components/privateProfile";
import ViewProfile from "./pages/ViewProfile";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
            <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
  <Route path="/myprofile" element={<MyProfile />} />
        {/* Profile setup (allowed after login but before main page) */}
        <Route path="/profileSetup" element={    <PrivateProfile><ProfileSetup /></PrivateProfile>} />

        {/* Protected Route: only accessible if logged in + profile complete */}
        <Route
          path="/mainPage"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>


          }
        />
        <Route path="/viewProfile/:id" element={<ViewProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
