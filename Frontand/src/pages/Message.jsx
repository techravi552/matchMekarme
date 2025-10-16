  import React from "react";
  import "../styles/massage.css"

  export default function Message({ chat }) {
    return (
      <div className="message">
        <img src={chat.photo} alt={chat.from} className="avatar" />
        <div className="msg-content">
          <div className="msg-header">
            <strong>{chat.from}</strong>
            <small>{new Date(chat.timeStamp).toLocaleTimeString()}</small>
          </div>
          <p>{chat.message}</p>
        </div>
      </div>
    );
  }
