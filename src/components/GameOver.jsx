import React, { useState, useEffect } from "react";
import "../styles/GameOver.css";

const GameOver = ({ onRestart, stats, time }) => {
  const [progress, setProgress] = useState(0);
  const [transporting, setTransporting] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (transporting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setTransporting(false), 500);
            return 100;
          }
          return prev + 1; // Lebih lambat (dari +2 ke +1)
        });
      }, 30); // 100*30ms = 3 detik
      return () => clearInterval(interval);
    }
  }, [transporting]);

  const handleRestart = () => {
    setButtonClicked(true);
    setFadeOut(true);
    setTimeout(() => {
      if (onRestart) onRestart();
      setButtonClicked(false);
    }, 500);
  };

  return (
    <div
      className={`game-over-overlay${fadeOut ? " fade-out" : ""}`}
      style={{
        backgroundImage: "url('/assets/gameover_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="game-over-container fade-in"
        style={{
          boxShadow: "0 0 20px rgba(255,0,0,0.5)",
          animation: fadeOut ? "fadeOut 0.5s ease-out forwards" : "fadeIn 1s ease-in",
          backgroundColor: "rgba(0,0,0,0.8)",
          maxWidth: 600,
          textAlign: "center",
          paddingTop: transporting ? 80 : 40,
        }}
      >
        {transporting ? (
          <>
            <p style={{ fontSize: "1.2em", marginBottom: 18, color: "#ff3333", fontWeight: 700, marginTop: 0 }}>You ran out of stamina and collapsed!</p>
            <p style={{ color: "#fff", marginBottom: 20 }}>Being transported to hospital...</p>
            <div style={{ background: "#222", borderRadius: 10, padding: 10, margin: "0 auto 20px auto", width: 300, maxWidth: "90%" }}>
              <div style={{ height: 18, background: "#444", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#ff3333", transition: "width 0.2s" }}></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="gameover-title" style={{ color: "#ff3333", fontSize: "3em", marginBottom: 20, textShadow: "0 0 10px rgba(255,0,0,0.7)" }}>
              GAME OVER
            </h1>
            <p style={{ fontSize: "1.2em", marginBottom: 30, color: "#fff", fontWeight: 700, marginTop: 0 }}>You ran out of stamina and collapsed!</p>
            <div className="stats" style={{ background: "rgba(50,50,50,0.7)", padding: 15, borderRadius: 5, marginBottom: 30, textAlign: "center" }}>
              <p>Days Survived: {time?.dayCount || 1}</p>
              <p>Final Money: ${stats?.money || 0}</p>
              <p>Happiness: {stats?.happy || 0}%</p>
              <p>Spiritual: {stats?.spiritual || 0}%</p>
            </div>
            <button
              className={`restart-button pixel-font${buttonClicked ? " clicked" : ""}`}
              style={{ backgroundColor: "#ff3333", color: "white", border: "none", padding: "12px 30px", fontSize: "1em", borderRadius: 5, cursor: "pointer", transition: "all 0.3s", marginTop: 1, marginBottom: 20 }}
              onClick={handleRestart}
            >
              Restart Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameOver;
