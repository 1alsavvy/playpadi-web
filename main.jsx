import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const API = "https://playpadi-api.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [messages, setMessages] = useState([
    "Someone here has main character energy 👀",
    "Big respect to the most hardworking person here 💯",
  ]);
  const [msg, setMsg] = useState("");

  async function createRoom() {
    if (!name.trim()) return alert("Enter your name first");

    const res = await fetch(`${API}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostName: name }),
    });

    const data = await res.json();
    setRoomCode(data.code);
  }

  function joinRoom() {
    if (!name.trim()) return alert("Enter your name first");
    if (!joinCode.trim()) return alert("Enter room code");
    setRoomCode(joinCode.toUpperCase());
  }

  function sendMessage() {
    if (!msg.trim()) return;
    setMessages([msg, ...messages]);
    setMsg("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.logo}>🎮 PlayPadi</h1>
          <span style={styles.badge}>V2 Live</span>
        </header>

        <section style={styles.hero}>
          <p style={styles.kicker}>Games + Rooms + Anonymous Fun</p>
          <h2 style={styles.title}>
            Play games. Join rooms. Say it anonymously.
          </h2>
          <p style={styles.subtitle}>
            Create a room, invite your friends on WhatsApp, play quick games,
            and drop anonymous messages in Spill Zone.
          </p>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button style={styles.primaryBtn} onClick={createRoom}>
              Create Room
            </button>
          </div>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button style={styles.secondaryBtn} onClick={joinRoom}>
              Join Room
            </button>
          </div>

          {roomCode && (
            <div style={styles.roomBox}>
              <p style={{ margin: 0, color: "#aaa" }}>Active Room</p>
              <h3 style={{ margin: "6px 0", fontSize: 36 }}>{roomCode}</h3>
              <a
                style={styles.whatsappBtn}
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🎮 Join my PlayPadi room: ${roomCode}`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Share to WhatsApp
              </a>
            </div>
          )}
        </section>

        <section style={styles.grid}>
          <GameCard emoji="🏫" title="Campus Clash" text="School vs school trivia battles." />
          <GameCard emoji="😂" title="Guess Am" text="Guess slang, trends and funny clues." />
          <GameCard emoji="⚡" title="Tap Race" text="Fastest fingers win the room." />
          <GameCard emoji="🔥" title="Spill Zone" text="Anonymous room messages." />
        </section>

        <section style={styles.spill}>
          <h2>🔥 Spill Zone</h2>
          <p style={styles.muted}>
            Send anonymous messages to the room. Keep it fun, respectful, and clean.
          </p>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="Type anonymous message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button style={styles.primaryBtn} onClick={sendMessage}>
              Send
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={styles.message}>
                <p style={{ margin: 0 }}>{m}</p>
                <small style={{ color: "#777" }}>Anonymous • now</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function GameCard({ emoji, title, text }) {
  return (
    <div style={styles.card}>
      <h3 style={{ fontSize: 24 }}>{emoji} {title}</h3>
      <p style={styles.muted}>{text}</p>
      <button style={styles.smallBtn}>Play Soon</button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #1a1a1a, #050505)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: 24,
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    fontSize: 36,
    margin: 0,
  },
  badge: {
    background: "#c7ff38",
    color: "#000",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: "bold",
  },
  hero: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
  },
  kicker: {
    color: "#c7ff38",
    fontWeight: "bold",
  },
  title: {
    fontSize: 48,
    lineHeight: 1.05,
    margin: "10px 0",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 18,
    maxWidth: 720,
  },
  inputRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 14,
  },
  input: {
    flex: 1,
    minWidth: 220,
    padding: 14,
    borderRadius: 14,
    border: "1px solid #333",
    background: "#050505",
    color: "white",
  },
  primaryBtn: {
    padding: "14px 20px",
    borderRadius: 14,
    border: 0,
    background: "#c7ff38",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 20px",
    borderRadius: 14,
    border: "1px solid #333",
    background: "transparent",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  roomBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    background: "#050505",
    border: "1px solid #222",
  },
  whatsappBtn: {
    display: "inline-block",
    marginTop: 10,
    padding: "12px 16px",
    borderRadius: 12,
    background: "#25D366",
    color: "#000",
    fontWeight: "bold",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 22,
    padding: 20,
  },
  muted: {
    color: "#aaa",
  },
  smallBtn: {
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #333",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
  spill: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 28,
    padding: 24,
  },
  message: {
    background: "#050505",
    border: "1px solid #222",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
