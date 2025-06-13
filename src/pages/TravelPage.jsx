import React from "react";

const TravelPage = ({ gameState, addMessage, updateStats, addTime, goToLocation }) => {
  return (
    <div
      className="location-view travel-view"
      style={{
        backgroundImage: "url('assets/choosetravel.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <div className="location-overlay">
        <button className="action-btn" onClick={() => goToLocation("Japan")}>JAPAN</button>
        <button className="action-btn" onClick={() => goToLocation("Singapore")}>SINGAPORE</button>
        <button className="action-btn secondary" onClick={() => goToLocation("Home")}>BACK</button>
      </div>
    </div>
  );
};

export default TravelPage;