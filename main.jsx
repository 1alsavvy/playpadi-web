import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1>🎮 PlayPadi</h1>
        <p>Play with friends instantly.</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
