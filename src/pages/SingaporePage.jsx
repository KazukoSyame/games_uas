// File: src/pages/SingaporePage.jsx
import React, { useState } from "react";

const bgMap = {
  main: "/assets/singapore.png",
  merlionpark: "/assets/merlionpark.png",
  universalstudio: "/assets/universalstudio.png",
  rollercoaster: "/assets/rollercoaster.png",
  shrek4d: "/assets/shrek4d.png",
  bugisstreet: "/assets/bugisstreet.png",
  bugismerchandise: "/assets/bugismerchandise.png",
  foodcourt: "/assets/foodcourt.png",
  kayatoast: "/assets/kayatoast.jpg",
  laksa: "/assets/laksa.png",
  singaporehotel: "/assets/singaporehotel.png",
};

const SingaporePage = ({ goToLocation, addMessage, updateStats, addTime, setIsSleeping }) => {
  const [subLocation, setSubLocation] = useState("main");

  const handlePhotoMerlion = () => {
    updateStats({ happy: 10, stamina: -10 });
    addTime(10);
    addMessage("You took a photo at Merlion Park. Happy +10, Stamina -10, Time +10 Minutes");
  };

  const handlePhotoUniversal = () => {
    updateStats({ happy: 15, stamina: -10 });
    addTime(15);
    addMessage("You took a photo at Universal Studio. Happy +15, Stamina -10, Time +15 Minutes");
  };

  const handleRollerCoaster = () => {
    updateStats({ happy: 20, stamina: -20, money: -30 });
    addTime(20);
    addMessage("You rode the Roller Coaster! Happy +20, Stamina -20, Money -30, Time +20 Minutes");
  };

  const handleWatchShrek = () => {
    updateStats({ happy: 15, stamina: -5, money: -20 });
    addTime(15);
    addMessage("You watched Shrek 4-D Adventure! Happy +15, Stamina -5, Money -20, Time +15 Minutes");
  };

  const handleBuyMerchandise = () => {
    updateStats({ happy: 10, money: -25 });
    addTime(10);
    addMessage("You bought Singapore Merchandise. Happy +10, Money -25, Time +10 Minutes");
  };

  const handleEatKayaToastAndCoffee = () => {
    updateStats({ happy: 10, stamina: 5, hunger: 20, money: -20 });
    addTime(10);
    addMessage("You bought a Kaya Toast and a coffee. Happy +10, Stamina +5, Hunger +20, Money -20, Time +10 Minutes");
  };

  const handleEatLaksa = () => {
    updateStats({ happy: 15, stamina: 10, hunger: 25, money: -20 });
    addTime(15);
    addMessage("You ate Laksa. Happy +15, Stamina +10, Hunger +25, Money -20, Time +15 Minutes");
  };

  const handleSleepHotel = () => {
    setIsSleeping(true);
    goToLocation("Singapore");
  };

  const handleGoToSubLocation = (locationKey, displayName) => {
    setSubLocation(locationKey);
    addMessage(`You went to ${displayName}.`);
  };

  const getOverlay = () => {
    switch (subLocation) {
      case "merlionpark":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handlePhotoMerlion}>
              TAKE A PHOTO
            </button>
            <button className="action-btn secondary" onClick={() => setSubLocation("main")}>
              BACK
            </button>
          </div>
        );
      case "universalstudio":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handlePhotoUniversal}>
              TAKE A PHOTO
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("rollercoaster", "Roller Coaster Park")}>
              ROLLER COASTER PARK
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("shrek4d", "Shrek 4-D Adventure")}>
              SHREK 4-D ADVENTURE
            </button>
            <button className="action-btn secondary" onClick={() => setSubLocation("main")}>
              BACK
            </button>
          </div>
        );
      case "rollercoaster":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleRollerCoaster}>
              RIDE A ROLLER COASTER
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("universalstudio", "Universal Studio")}>
              BACK
            </button>
          </div>
        );
      case "shrek4d":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleWatchShrek}>
              WATCH 4D FILM
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("universalstudio", "Universal Studio")}>
              BACK
            </button>
          </div>
        );
      case "bugisstreet":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleBuyMerchandise}>
              MERCHANDISE STORE
            </button>
            <button className="action-btn" onClick={handleEatKayaToastAndCoffee}>
              COFFEE STALL
            </button>
            <button className="action-btn" onClick={handleEatLaksa}>
              LAKSA KIOSK
            </button>
            <button className="action-btn secondary" onClick={() => setSubLocation("main")}>
              BACK
            </button>
          </div>
        );
      case "bugismerchandise":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleBuyMerchandise}>
              BUY MERCHANDISE
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("bugisstreet", "Bugis Street")}>
              BACK
            </button>
          </div>
        );
      case "kayatoast":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleEatKayaToastAndCoffee}>
              EAT KAYA TOAST
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("bugisstreet", "Bugis Street")}>
              BACK
            </button>
          </div>
        );
      case "laksa":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleEatLaksa}>
              EAT LAKSA
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("bugisstreet", "Bugis Street")}>
              BACK
            </button>
          </div>
        );
      case "singaporehotel":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleSleepHotel}>
              SLEEP
            </button>
            <button className="action-btn secondary" onClick={() => setSubLocation("main")}>
              BACK
            </button>
          </div>
        );
      default:
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={() => handleGoToSubLocation("merlionpark", "Merlion Park")}>
              MERLION PARK
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("universalstudio", "Universal Studio")}>
              UNIVERSAL STUDIO
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("bugisstreet", "Bugis Street")}>
              BUGIS STREET
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("singaporehotel", "Hotel")}>
              HOTEL
            </button>
            <button className="action-btn secondary" onClick={() => goToLocation("Travel")}>
              BACK
            </button>
          </div>
        );
    }
  };

  return (
    <div
      className="location-view singapore-view"
      style={{
        backgroundImage: `url('${bgMap[subLocation] || bgMap.main}')`,
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
      {getOverlay()}
    </div>
  );
};

export default SingaporePage;
