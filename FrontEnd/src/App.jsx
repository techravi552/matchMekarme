import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Main from "./pages/Main";
import ProfilePage from "./pages/ProfilePage";
import UserDetails from "./pages/UserDetails";
import ChatPage from "./pages/ChatPage";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import UpdateProfile from "./pages/UpdataProfile";
import GroupChat from "./pages/GroupChat";
import ProtectedRoute from "./components/ProtectedRoute"; // 👈 नया import
import About from "./pages/About";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

<Route path="/about" element={<About />} />
      
      {/* Protected Routes */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/details/:email"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:email"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <GroupChat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
