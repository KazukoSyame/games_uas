import React, { useState, useEffect } from "react";

const bgMap = {
  main: "/assets/japan.png",
  mountfuji: "/assets/gunungfuji.jpg",
  tokyoplaza: "/assets/tokyoplaza.jpg",
  mangastore: "/assets/mangastore.png",
  gundamstore: "/assets/gundamstore.png",
  kyoto: "/assets/eatselect.jpg",
  hotel: "/assets/jphotel.png",
  ramenstall: "/assets/ramenstall.png",
  sushikiosk: "/assets/sushikiosk.png",
  shrine: "/assets/shrine.png",
};

const MangaOverlay = ({ onClose }) => {
  const story = `
The story begins with Uther Pendragon, the king of Britain, who desires Igraine, the wife of Duke Gorlois of Cornwall. With the help of the wizard Merlin, Uther disguises himself as Gorlois and conceives a child with Igraine. In exchange for his magical aid, Merlin takes the newborn Arthur and raises him in secret, knowing the boy is destined for greatness.

After Uther’s death, Britain falls into chaos, with no clear heir to the throne. Merlin sets a test: whoever can pull the enchanted sword Excalibur from a stone will be the rightful king. Many knights fail, but young Arthur, serving as a squire to his foster brother Sir Kay, effortlessly draws the sword, revealing his divine right to rule. Crowned king, Arthur establishes his court at Camelot and gathers the bravest knights as his Knights of the Round Table, a symbol of equality and unity.

Arthur’s reign is marked by heroic quests, including the search for the Holy Grail, the sacred cup of Christ. His greatest knight, Sir Lancelot, becomes entangled in a forbidden love affair with Arthur’s queen, Guinevere, leading to betrayal and civil war. Meanwhile, Arthur’s illegitimate son, Mordred, seizes power in his absence. The story culminates in the Battle of Camlann, where Arthur and Mordred mortally wound each other. As he dies, Arthur orders Excalibur thrown back into the lake, where a mystical hand retrieves it. According to legend, he is taken to the isle of Avalon, where he rests until Britain’s hour of greatest need.
`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="manga-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          width: "80%",
          maxWidth: "700px",
          maxHeight: "80%",
          overflowY: "auto",
          boxShadow: "0 0 10px #000",
          whiteSpace: "pre-line",
        }}
      >
        <h3>Manga Story</h3>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "black",
            textShadow: "none",
          }}
        >
          {story}
        </p>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const JapanPage = ({ goToLocation, addMessage, updateStats, addTime, setIsSleeping }) => {
  const [subLocation, setSubLocation] = useState("main");
  const [showManga, setShowManga] = useState(false);

  useEffect(() => {
    window.useItemEffect = (item) => {
      if (item.effect === "buildGundam") {
        updateStats({ happy: 25 });
        addTime(120);
        addMessage("You built the Gundam! Happy +25, Time +2 hours.");
        if (window.completeObjective && !(window.completedObjectives?.includes?.(1))) {
          window.completeObjective(1);
          window.completedObjectives = [...(window.completedObjectives || []), 1];
        }
      } else if (item.effect === "readManga") {
        setShowManga(true);
        updateStats({ happy: 25, stamina: -10 });
        addTime(20);
        addMessage("You've read a Manga. Happy +25, Stamina -10, Time +20 Minutes");
        if (window.completeObjective && !(window.completedObjectives?.includes?.(2))) {
          window.completeObjective(2);
          window.completedObjectives = [...(window.completedObjectives || []), 2];
        }
      }
    };
  }, [updateStats, addTime, addMessage]);

  // Hide message log when manga overlay is open
  useEffect(() => {
    const logElement = document.querySelector(".message-log");
    if (!logElement) return;

    logElement.style.display = showManga ? "none" : "block";
  }, [showManga]);

  const handlePhoto = () => {
    updateStats({ happy: 15, stamina: -15 });
    addTime(10);
    addMessage("You spent time in Mount Fuji. Happy +15, Stamina -15, Time +10 Minutes");
  };

  const handleBuyManga = () => {
    updateStats({ happy: 25, stamina: -10, money: -25 });
    addTime(20);
    addMessage("You bought a Manga at Manga Store.‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎ ‎ ‎  ‎ ‎ Check your inventory to read it.");

    window.addItemToInventory &&
      window.addItemToInventory({
        id: "manga",
        name: "Manga",
        type: "usable",
        image: "./assets/manga_book.png",
        description: "A Japanese comic book. Right click to read.",
        effect: "readManga",
        value: 1,
      });
  };

  const handleBuyFigure = () => {
    updateStats({ happy: 25, stamina: -10, money: -50 });
    addTime(20);
    addMessage("You bought a Gundam at Action Figure Store.‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎   Check your inventory.");

    window.addItemToInventory &&
      window.addItemToInventory({
        id: "gundam",
        name: "Gundam Kit",
        type: "usable",
        image: "./assets/gundam_kit.png",
        description: "A Gundam model kit. Right click to build.",
        effect: "buildGundam",
        value: 1,
      });
  };

  const handleEatSushi = () => {
    updateStats({ happy: 20, stamina: 10, money: -20 });
    addTime(15);
    addMessage("You've eaten Sushi at Sushi Kiosk. Happy +20, Stamina +10, Money -20, Time +15 Minutes");
  };

  const handleEatRamen = () => {
    updateStats({ happy: 20, stamina: 10, money: -35 });
    addTime(15);
    addMessage("You've eaten Ramen at Ramen Stall. Happy +20, Stamina +10, Money -35, Time +15 Minutes");
  };

  const handleSleepHotel = () => {
    setIsSleeping(true);
    goToLocation("Japan");
  };

  const handlePrayShrine = () => {
    updateStats({ spiritual: 25, stamina: -5 });
    addTime(30);
    addMessage("You prayed at the Shrine. Spiritual +25, Stamina -5, Time +30 Minutes");
  };

  const handleGoToSubLocation = (locationKey, displayName) => {
    setSubLocation(locationKey);
    addMessage(`You went to ${displayName}.`);
  };

  const getOverlay = () => {
    switch (subLocation) {
      case "mountfuji":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handlePhoto}>
              TAKE A PHOTO
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("main", "Main Area")}>
              BACK
            </button>
          </div>
        );
      case "tokyoplaza":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleBuyManga}>
              BUY MANGA
            </button>
            <button className="action-btn" onClick={handleBuyFigure}>
              BUY GUNDAM
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("main", "Main Area")}>
              BACK
            </button>
          </div>
        );
      case "mangastore":
      case "gundamstore":
        return null;
      case "kyoto":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleEatSushi}>
              EAT SUSHI
            </button>
            <button className="action-btn" onClick={handleEatRamen}>
              EAT RAMEN
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("main", "Main Area")}>
              BACK
            </button>
          </div>
        );
      case "hotel":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handleSleepHotel}>
              SLEEP
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("main", "Main Area")}>
              BACK
            </button>
          </div>
        );
      case "shrine":
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={handlePrayShrine}>
              PRAY
            </button>
            <button className="action-btn secondary" onClick={() => handleGoToSubLocation("main", "Main Area")}>
              BACK
            </button>
          </div>
        );
      default:
        return (
          <div className="location-overlay">
            <button className="action-btn" onClick={() => handleGoToSubLocation("mountfuji", "Mount Fuji")}>
              MOUNT FUJI
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("tokyoplaza", "Tokyo Plaza")}>
              TOKYO PLAZA
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("kyoto", "Kyoto Street")}>
              KYOTO STREET
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("hotel", "Hotel")}>
              HOTEL
            </button>
            <button className="action-btn" onClick={() => handleGoToSubLocation("shrine", "Shrine")}>
              SHRINE
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
      className="location-view japan-view"
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
      {showManga && <MangaOverlay onClose={() => setShowManga(false)} />}
    </div>
  );
};

export default JapanPage;
