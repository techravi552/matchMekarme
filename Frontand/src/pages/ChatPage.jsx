import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { email } = useParams(); // whom to chat with
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    // load existing chats
    let chats = JSON.parse(localStorage.getItem("chats")) || {};
    let chatKey = getChatKey(currentUser.email, email);
    setMessages(chats[chatKey] || []);
  }, [email]);

  const getChatKey = (email1, email2) => {
    return [email1, email2].sort().join("_");
  };

  const handleSend = () => {
    if (!input) return;

    let chats = JSON.parse(localStorage.getItem("chats")) || {};
    let chatKey = getChatKey(currentUser.email, email);
    let newMsg = { from: currentUser.email, text: input, time: new Date().toLocaleTimeString() };

    let updated = [...(chats[chatKey] || []), newMsg];
    chats[chatKey] = updated;

    localStorage.setItem("chats", JSON.stringify(chats));
    setMessages(updated);
    setInput("");
  };

  return (
    <div className="chat-page">
      <h2>Chat with {email}</h2>
      <div className="chat-box">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`chat-msg ${m.from === currentUser.email ? "me" : "other"}`}
          >
            <p>{m.text}</p>
            <span>{m.time}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
