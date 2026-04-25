function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#050505,#111)",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "24px"
    }}>
      <div style={{maxWidth:"1000px",margin:"0 auto"}}>
        <h1 style={{fontSize:"48px"}}>🎮 PlayPadi</h1>
        <p style={{color:"#aaa",fontSize:"20px"}}>
          Challenge your friends. Win bragging rights.
        </p>

        <div style={{display:"flex",gap:"12px",marginTop:"20px",flexWrap:"wrap"}}>
          <button style={{
            padding:"14px 20px",
            borderRadius:"14px",
            border:0,
            background:"#c7ff38",
            fontWeight:"bold"
          }}>
            Create Room
          </button>

          <button style={{
            padding:"14px 20px",
            borderRadius:"14px",
            border:"1px solid #333",
            background:"transparent",
            color:"#fff"
          }}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
