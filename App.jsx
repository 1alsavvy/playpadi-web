
export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <div>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          🎮 PlayPadi
        </h1>

        <p style={{ color: "#9ca3af", fontSize: "18px" }}>
          Play with friends instantly.
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "14px 24px",
            borderRadius: "12px",
            border: "none",
            background: "#c7ff38",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Start Playing
        </button>
      </div>
    </div>
  );
}
