import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Messages() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // LocalStorage से chat keys निकालना
    let keys = Object.keys(localStorage).filter((k) => k.startsWith("chat-"));
    let list = keys.map((k) => {
      let msgs = JSON.parse(localStorage.getItem(k)) || [];
      return { id: k.split("-")[1], lastMsg: msgs[msgs.length - 1]?.text || "No messages yet" };
    });
    setChats(list);
  }, []);

  return (
    <div className="messages">
      <h2>Your Chats</h2>
      {chats.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        chats.map((c, i) => (
          <div key={i} className="chat-item">
            <p>Partner ID: {c.id}</p>
            <p>Last Msg: {c.lastMsg}</p>
            <Link to={`/chat/${c.id}`}><button>Open Chat</button></Link>
          </div>
        ))
      )}
    </div>
  );
}
