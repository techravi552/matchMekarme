import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../styles/GroupChat.css";
import Navbar from "../components/Navbar";

const socket = io("http://localhost:5000");

export default function GroupChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
useEffect(() => {
  if (!currentUser) return;

  // Register user only once
  socket.emit("registerUser", {
    name: currentUser.name,
    photo: currentUser.photo,
  });

  // Listen for chat history
  socket.on("chat_History", (data) => {
    setChatHistory(data);
  });

  // Cleanup
  return () => {
    socket.off("chat_History");
  };
}, []); // ✅ empty dependency — run only once

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
<> 
<Navbar/>

   <div className="chat-container">
      <h2>💬 Group Chat</h2>
     

      <div className="chat-box">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-item ${
              chat.from === currentUser.name ? "own-message" : ""
            }`}
          >
            <img src={chat.photo} alt={chat.from} className="chat-photo" />
            <div className="chat-content">
              <span className="chat-user">{chat.from}</span>
              <p className="chat-text">{chat.message}</p>
              <span className="chat-time">
                {new Date(chat.timeStamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
    </>

  );
}
