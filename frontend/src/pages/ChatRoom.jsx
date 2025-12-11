import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ChatRoom() {
  const { proposalId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ---- Load messages ----
  const loadMessages = async () => {
    const res = await fetch(
      `http://localhost:5000/api/messages/${proposalId}`
    );
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // ---- Send message ----
  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proposalId: Number(proposalId),
        senderId: user.id,
        senderName: user.name, // show name not ID
        text: input,
      }),
    });

    setInput("");
    loadMessages(); // refresh chat
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room</h2>
      <button
        onClick={() => {
         const user = JSON.parse(localStorage.getItem("user"));

         if (user.role === "client") {
          window.location.href = "/client-dashboard";
         } else if (user.role === "freelancer") {
          window.location.href = "/freelancer-dashboard";
         } else {
          window.location.href = "/";
        }
       }}
       style={{
        marginBottom: 15,
        padding: "8px 14px",
        background: "#eee",
        border: "1px solid #ccc",
        cursor: "pointer",
       }}
     >
        ← Back
      </button>


      <div
        style={{
          border: "1px solid #aaa",
          padding: 10,
          height: 350,
          overflowY: "auto",
          marginBottom: 20,
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                border: "1px solid #ddd",
                padding: 8,
                marginBottom: 8,
                background: "#f8f8f8",
              }}
            >
              <p>
                <strong>{m.senderName}</strong>:
              </p>
              <p>{m.text}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "70%", padding: 8 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
