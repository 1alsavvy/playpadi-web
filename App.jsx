
import React, {useEffect, useState} from "react";

const API="https://playpadi-api.onrender.com";

export default function App(){
 const [name,setName]=useState("");
 const [room,setRoom]=useState("");
 const [health,setHealth]=useState("Checking backend...");
 const [scores,setScores]=useState([]);

 useEffect(()=>{
   fetch(API+"/health").then(r=>r.json()).then(d=>setHealth("Backend Live")).catch(()=>setHealth("Backend sleeping / unavailable"));
   fetch(API+"/scores").then(r=>r.json()).then(setScores).catch(()=>{});
 },[]);

 async function createRoom(){
   if(!name) return alert("Enter your name");
   const r=await fetch(API+"/rooms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hostName:name})});
   const d=await r.json();
   setRoom(d.code);
 }

 return <div style={{maxWidth:900,margin:"0 auto",padding:24}}>
   <h1 style={{fontSize:48,marginBottom:8}}>🎮 PlayPadi</h1>
   <p style={{color:"#9ca3af"}}>Play with friends instantly.</p>
   <p>{health}</p>

   <div style={{background:"#111",padding:20,borderRadius:18,marginTop:20}}>
    <h2>Start Playing</h2>
    <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}
      style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #333",background:"#000",color:"#fff"}} />
    <button onClick={createRoom} style={{marginTop:12,padding:"12px 18px",borderRadius:12,border:0,background:"#c7ff38",fontWeight:700}}>Create Room</button>
    {room && <p style={{marginTop:12}}>Room Code: <strong>{room}</strong></p>}
   </div>

   <div style={{background:"#111",padding:20,borderRadius:18,marginTop:20}}>
    <h2>Leaderboard</h2>
    {scores.length===0 ? <p>No scores yet.</p> :
      scores.slice(0,10).map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #222"}}>
        <span>{i+1}. {s.name}</span><strong>{s.score}</strong>
      </div>)
    }
   </div>
 </div>
}
