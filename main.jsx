
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

const API = "https://playpadi-api.onrender.com";

const quizGames = {
  "Campus Clash": [
    { q: "Which university is popularly called Legon?", options: ["KNUST", "University of Ghana", "UHAS"], answer: "University of Ghana" },
    { q: "Which city is UHAS located in?", options: ["Ho", "Kumasi", "Cape Coast"], answer: "Ho" },
    { q: "What does GPA stand for?", options: ["Grade Point Average", "General Pass Award", "Global Pass Average"], answer: "Grade Point Average" }
  ],
  "Guess Am": [
    { q: "What does chale mostly mean?", options: ["Friend", "Food", "Money"], answer: "Friend" },
    { q: "What does soft life mean?", options: ["Easy living", "Stressful living", "Office work"], answer: "Easy living" },
    { q: "What does vibes mostly mean?", options: ["Mood", "Phone", "Book"], answer: "Mood" }
  ]
};

function App() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [activeGame, setActiveGame] = useState("");
  const [score, setScore] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [targetNumber, setTargetNumber] = useState(randNumber());
  const [guess, setGuess] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPicked, setQuizPicked] = useState("");
  const [message, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [status, setStatus] = useState("");

  const currentQuiz = quizGames[activeGame]?.[quizIndex];

  useEffect(() => { loadScores(); }, []);

  useEffect(() => {
    if (!roomCode) return;
    loadRoom();
    const t = setInterval(loadRoom, 5000);
    return () => clearInterval(t);
  }, [roomCode]);

  function randNumber() { return Math.floor(Math.random() * 20) + 1; }

  async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  }

  async function createRoom() {
    if (!name.trim()) return alert("Enter your name first");
    try {
      const data = await api("/rooms", { method: "POST", body: JSON.stringify({ hostName: name }) });
      setRoomCode(data.code);
      setJoinCode(data.code);
      setStatus(`Room ${data.code} created`);
    } catch { alert("Backend is waking up. Try again in a few seconds."); }
  }

  async function joinRoom() {
    if (!name.trim()) return alert("Enter your name first");
    if (!joinCode.trim()) return alert("Enter room code");
    try {
      const code = joinCode.trim().toUpperCase();
      await api(`/rooms/${code}/join`, { method: "POST", body: JSON.stringify({ name }) });
      setRoomCode(code);
      setStatus(`Joined room ${code}`);
    } catch { alert("Room not found. Create a room first or check the code."); }
  }

  async function loadRoom() {
    try {
      const data = await api(`/rooms/${roomCode}`);
      setRoomMessages(data.messages || []);
    } catch {}
  }

  async function loadScores() {
    try {
      const data = await api("/scores");
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch {}
  }

  async function saveScore(gameTitle, finalScore) {
    if (!name.trim()) return alert("Enter your name first");
    try {
      const data = await api("/scores", {
        method: "POST",
        body: JSON.stringify({ name, score: finalScore, roomCode: roomCode || "SOLO", gameTitle })
      });
      setLeaderboard(Array.isArray(data) ? data : []);
      setStatus(`${gameTitle} score saved`);
    } catch { alert("Score failed to save."); }
  }

  function startGame(game) {
    setActiveGame(game);
    setScore(0);
    setTapCount(0);
    setGuess("");
    setTargetNumber(randNumber());
    setQuizIndex(0);
    setQuizPicked("");
  }

  function answerQuiz(option) {
    if (quizPicked) return;
    setQuizPicked(option);
    if (option === currentQuiz.answer) setScore((s) => s + 100);
  }

  function nextQuiz() {
    const list = quizGames[activeGame];
    if (quizIndex < list.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizPicked("");
    } else {
      saveScore(activeGame, score);
      setActiveGame("");
    }
  }

  function finishTapRace() {
    const finalScore = tapCount * 10;
    setScore(finalScore);
    saveScore("Tap Race", finalScore);
  }

  function submitGuess() {
    const number = Number(guess);
    if (!number) return;
    const difference = Math.abs(targetNumber - number);
    const finalScore = Math.max(0, 200 - difference * 20);
    saveScore("Guess Number", finalScore);
    alert(`Target was ${targetNumber}. You scored ${finalScore}.`);
    setActiveGame("");
  }

  async function sendAnonymous() {
    if (!roomCode) return alert("Create or join a room first");
    if (!message.trim()) return;
    try {
      const newMsg = await api(`/rooms/${roomCode}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: message })
      });
      setRoomMessages((prev) => [newMsg, ...prev]);
      setMessage("");
    } catch { alert("Message failed. Try again."); }
  }

  const shareLink = useMemo(() => `https://wa.me/?text=${encodeURIComponent(roomCode ? `🎮 Join my PlayPadi room: ${roomCode}` : "🎮 Join me on PlayPadi!")}`, [roomCode]);

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <header style={styles.header}>
          <h1 style={styles.logo}>🎮 PlayPadi</h1>
          <span style={styles.badge}>V3 Working</span>
        </header>

        {activeGame ? (
          <GameScreen
            game={activeGame}
            score={score}
            tapCount={tapCount}
            setTapCount={setTapCount}
            finishTapRace={finishTapRace}
            guess={guess}
            setGuess={setGuess}
            submitGuess={submitGuess}
            currentQuiz={currentQuiz}
            quizPicked={quizPicked}
            answerQuiz={answerQuiz}
            nextQuiz={nextQuiz}
            close={() => setActiveGame("")}
          />
        ) : (
          <>
            <section style={styles.hero}>
              <p style={styles.kicker}>Games + Rooms + Anonymous Fun</p>
              <h2 style={styles.title}>Play games. Join rooms. Say it anonymously.</h2>
              <p style={styles.subtitle}>Create a room, invite friends on WhatsApp, play quick games, and drop anonymous messages in Spill Zone.</p>

              <div style={styles.row}>
                <input style={styles.input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <button style={styles.primary} onClick={createRoom}>Create Room</button>
              </div>

              <div style={styles.row}>
                <input style={styles.input} placeholder="Enter room code" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} />
                <button style={styles.secondary} onClick={joinRoom}>Join Room</button>
              </div>

              {roomCode && (
                <div style={styles.roomBox}>
                  <p style={styles.muted}>Active Room</p>
                  <h3 style={styles.roomCode}>{roomCode}</h3>
                  <a href={shareLink} target="_blank" rel="noreferrer" style={styles.whatsapp}>Share to WhatsApp</a>
                </div>
              )}

              {status && <p style={styles.status}>{status}</p>}
            </section>

            <section style={styles.grid}>
              <GameCard emoji="🏫" title="Campus Clash" text="School vs school trivia battle." onClick={() => startGame("Campus Clash")} />
              <GameCard emoji="😂" title="Guess Am" text="Guess slang and funny clues." onClick={() => startGame("Guess Am")} />
              <GameCard emoji="⚡" title="Tap Race" text="Tap as fast as possible." onClick={() => startGame("Tap Race")} />
              <GameCard emoji="🎯" title="Guess Number" text="Guess the secret number." onClick={() => startGame("Guess Number")} />
            </section>

            <section style={styles.panel}>
              <h2>🔥 Spill Zone</h2>
              <p style={styles.muted}>Anonymous room messages. Create or join a room first.</p>
              <div style={styles.row}>
                <input style={styles.input} placeholder="Type anonymous message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <button style={styles.primary} onClick={sendAnonymous}>Send</button>
              </div>
              <div style={{ marginTop: 16 }}>
                {roomMessages.length === 0 ? <p style={styles.muted}>No messages yet.</p> : roomMessages.map((m) => (
                  <div key={m.id} style={styles.message}>
                    <p style={{ margin: 0 }}>{m.text}</p>
                    <small style={{ color: "#777" }}>Anonymous</small>
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.panel}>
              <h2>🏆 Leaderboard</h2>
              {leaderboard.length === 0 ? <p style={styles.muted}>No scores yet.</p> : leaderboard.slice(0, 10).map((s, i) => (
                <div key={s.id || i} style={styles.leader}>
                  <span>{i + 1}. {s.name} · {s.gameTitle}</span>
                  <strong>{s.score}</strong>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function GameScreen(props) {
  if (props.game === "Tap Race") {
    return (
      <section style={styles.hero}>
        <button style={styles.secondary} onClick={props.close}>Back</button>
        <h2 style={styles.title}>⚡ Tap Race</h2>
        <p style={styles.subtitle}>Tap as fast as you can, then save your score.</p>
        <h3 style={{ fontSize: 64 }}>{props.tapCount}</h3>
        <button style={styles.primaryBig} onClick={() => props.setTapCount((n) => n + 1)}>TAP!</button>
        <button style={styles.secondary} onClick={props.finishTapRace}>Finish & Save</button>
      </section>
    );
  }

  if (props.game === "Guess Number") {
    return (
      <section style={styles.hero}>
        <button style={styles.secondary} onClick={props.close}>Back</button>
        <h2 style={styles.title}>🎯 Guess Number</h2>
        <p style={styles.subtitle}>Guess a number from 1 to 20. The closer you are, the more points you get.</p>
        <div style={styles.row}>
          <input style={styles.input} placeholder="Your guess" value={props.guess} onChange={(e) => props.setGuess(e.target.value)} />
          <button style={styles.primary} onClick={props.submitGuess}>Submit</button>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.hero}>
      <button style={styles.secondary} onClick={props.close}>Back</button>
      <h2 style={styles.title}>{props.game}</h2>
      <p style={styles.subtitle}>Score: {props.score}</p>
      <h3 style={{ fontSize: 28 }}>{props.currentQuiz.q}</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {props.currentQuiz.options.map((option) => {
          const picked = props.quizPicked === option;
          const correct = props.quizPicked && option === props.currentQuiz.answer;
          return (
            <button key={option} onClick={() => props.answerQuiz(option)} style={{
              ...styles.answer,
              background: correct ? "#c7ff38" : picked ? "#fff" : "#050505",
              color: correct || picked ? "#000" : "#fff"
            }}>{option}</button>
          );
        })}
      </div>
      {props.quizPicked && <button style={styles.primary} onClick={props.nextQuiz}>Next / Save</button>}
    </section>
  );
}

function GameCard({ emoji, title, text, onClick }) {
  return (
    <div style={styles.card}>
      <h3>{emoji} {title}</h3>
      <p style={styles.muted}>{text}</p>
      <button style={styles.secondary} onClick={onClick}>Play Now</button>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "radial-gradient(circle at top,#1a1a1a,#050505)", color: "white", fontFamily: "Arial,sans-serif", padding: 24 },
  wrap: { maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  logo: { fontSize: 38, margin: 0 },
  badge: { background: "#c7ff38", color: "#000", padding: "8px 14px", borderRadius: 999, fontWeight: "bold" },
  hero: { background: "#111", border: "1px solid #222", borderRadius: 28, padding: 28, marginBottom: 24 },
  kicker: { color: "#c7ff38", fontWeight: "bold" },
  title: { fontSize: 48, lineHeight: 1.05, margin: "10px 0" },
  subtitle: { color: "#aaa", fontSize: 18, maxWidth: 720 },
  row: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 },
  input: { flex: 1, minWidth: 220, padding: 14, borderRadius: 14, border: "1px solid #333", background: "#050505", color: "white" },
  primary: { padding: "14px 20px", borderRadius: 14, border: 0, background: "#c7ff38", color: "#000", fontWeight: "bold", cursor: "pointer" },
  primaryBig: { padding: "28px 42px", borderRadius: 20, border: 0, background: "#c7ff38", color: "#000", fontWeight: "bold", cursor: "pointer", fontSize: 28, marginRight: 12 },
  secondary: { padding: "12px 18px", borderRadius: 14, border: "1px solid #333", background: "transparent", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: 8 },
  roomBox: { marginTop: 20, padding: 20, borderRadius: 20, background: "#050505", border: "1px solid #222" },
  roomCode: { margin: "6px 0", fontSize: 36 },
  whatsapp: { display: "inline-block", marginTop: 10, padding: "12px 16px", borderRadius: 12, background: "#25D366", color: "#000", fontWeight: "bold", textDecoration: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 24 },
  card: { background: "#111", border: "1px solid #222", borderRadius: 22, padding: 20 },
  panel: { background: "#111", border: "1px solid #222", borderRadius: 28, padding: 24, marginBottom: 24 },
  muted: { color: "#aaa", margin: 0 },
  status: { color: "#c7ff38", marginTop: 16 },
  message: { background: "#050505", border: "1px solid #222", borderRadius: 16, padding: 14, marginBottom: 10 },
  leader: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", padding: "12px 0" },
  answer: { padding: 14, borderRadius: 14, border: "1px solid #333", cursor: "pointer", textAlign: "left" }
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
