// File: src/pages/ChurchPage.jsx
import { useEffect } from 'react';

const ChurchPage = ({ gameState, addMessage, updateStats, addTime, goToLocation }) => {
  const pray = () => {
    if (gameState.stamina < 10) {
      addMessage("You're too tired to pray properly.");
      return;
    }

    updateStats({ 
      spiritual: 25, 
      happy: 15, 
      stamina: -10 
    });
    addTime(45);
    addMessage("You spent time in Prayer. Spiritual +25, Happy +15, Stamina -10, Time +45 minutes");
  };

  return (
    <div
      className="location-view church-view"
      style={{
        backgroundImage: "url('/assets/church.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <div className="location-overlay">
        <button className="action-btn" onClick={pray}>PRAY</button>
        <button className="action-btn secondary" onClick={() => goToLocation('Home')}>BACK</button>
      </div>
    </div>
  );
};

export default ChurchPage;