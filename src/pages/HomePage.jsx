import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StatDisplay from "../components/StatDisplay/StatDisplay";
import Inventory from "../Inventory";
import LocationView from "../components/LocationView";
import MessageLog from "../components/MessageLog";
import TimeDisplay from "../components/TimeDisplay";
import "../styles/HomePage.css";
import MapButton from "../components/MapButton";
import MapScreen from "../components/MapScreen";
import ChurchPage from "../pages/ChurchPage";
import CafeSection from "../pages/CafePage";
import SleepOverlay from "../components/SleepOverlay";
import TravelPage from "../pages/TravelPage";
import JapanPage from "../pages/JapanPage";
import SingaporePage from "../pages/SingaporePage";
import BackgroundPath from "../components/BackgroundPath";
import { saveOnSleep, loadProgress, saveProgress, defaultProgress, saveToFirebase } from "../data/defaultProgress"; // Import fungsi save & load
import { handleLogin } from "./LoginPages"; // Impor handleLogin
import EventSystem from "../components/EventSystem";
import Settings from "../components/Settings"; // Import komponen Settings
import GameOver from "../components/GameOver";
import Objectives from "../components/Objectives";
// web deploy : http://localhost:5173/
const HomePage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const collapseAudioRef = useRef(null); // Tambahkan useRef baru untuk sound effect

  const [gameState, setGameState] = useState({
    hunger: 50,
    money: 100,
    stamina: 100,
    happy: 50,
    spiritual: 0,
    currentLocation: "Home",
  });

  const [messages, setMessages] = useState(["> Hellow ♪(´▽｀)"]);
  const [time, setTime] = useState({
    day: "Monday",
    dayCount: 1,
    hours: 6,
    minutes: 29,
  });

  const [fastForwardRemaining, setFastForwardRemaining] = useState(3);
  const [showFastForwardConfirm, setShowFastForwardConfirm] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [showGameContent, setShowGameContent] = useState(true);
  const [showSettings, setShowSettings] = useState(false); // Tambahkan state untuk Settings
  const [showObjectives, setShowObjectives] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState([]);

  const [mapState, setMapState] = useState({
    isOpen: false,
    avatarPosition: { x: 50, y: 50 },
    currentLocation: null,
  });

  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 });
  const [characterDirection, setCharacterDirection] = useState("down");
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [animationFrame, setAnimationFrame] = useState(1);
  const [isMoving, setIsMoving] = useState(false);

  const [currentInteractiveObject, setCurrentInteractiveObject] = useState(null);
  const [inventory, setInventory] = useState([]);

  const [isCollapsed, setIsCollapsed] = useState(false); // Tambahkan state baru untuk collapsed
  const [showGameOver, setShowGameOver] = useState(false); // Tambahkan state baru untuk game over

  const [volume, setVolume] = useState(1); // Tambahkan state untuk volume

  const spriteConfig = {
    width: 135,
    height: 135,
    frames: 2,
    directions: {
      down: 0,
      left: 1,
      right: 2,
      up: 3,
    },
    animationSpeed: 10,
  };

  // Location-specific interactive areas
  const interactiveAreas = {
    Home: {
      bedroomDoor: { x: 18, y: 30, width: 50, height: 20, type: "door", target: "Bedroom" },
    },
    Bedroom: {
      homeDoor: { x: 90, y: 50, width: 10, height: 20, type: "door", target: "Home" },
      bed: { x: 70, y: 70, width: 20, height: 15, type: "bed" },
      tv: { x: 18, y: 30, width: 10, height: 10, type: "tv" },
    },
    Kitchen: {
      homeDoor: { x: 90, y: 50, width: 10, height: 20, type: "door", target: "Home" },
      table: { x: 40, y: 60, width: 20, height: 10, type: "table" },
    },
  };

  const getFormattedTime = () => {
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`;
  };

  const addMessage = (message) => {
    setMessages((prev) => [...prev, `> ${message}`]);
  };

  const updateStats = (stats) => {
    setGameState((prev) => {
      const newStats = { ...prev };
      for (const stat in stats) {
        if (["stamina", "happy", "spiritual", "hunger"].includes(stat)) {
          // Pastikan nilai adalah angka dan dalam rentang 0-100
          const value = Number(stats[stat]);
          newStats[stat] = Math.max(0, Math.min(100, prev[stat] + (isNaN(value) ? 0 : value)));
        } else if (stat === "money") {
          const value = Number(stats[stat]);
          newStats[stat] = Math.max(0, prev[stat] + (isNaN(value) ? 0 : value));
        }
      }
      // Check if stamina reaches 0
      if (newStats.stamina <= 0 && !isCollapsed) {
        setIsCollapsed(true);
        setShowGameOver(true);
        addMessage("You collapsed from exhaustion!");
        // Pause background music
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // Play collapse sound effect
        if (collapseAudioRef.current) {
          collapseAudioRef.current.volume = 0.7; // Sesuaikan volume
          collapseAudioRef.current.play();
        }
      }

      return newStats;
    });
  };

  const addTime = (minutes) => {
    setTime((prev) => {
      let totalMinutes = prev.hours * 60 + prev.minutes + minutes;
      let newHours = Math.floor(totalMinutes / 60) % 24;
      let newMinutes = totalMinutes % 60;
      let daysToAdd = Math.floor(totalMinutes / (24 * 60));

      let newDay = prev.day;
      let newDayCount = prev.dayCount;

      if (daysToAdd > 0) {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const currentIndex = days.indexOf(prev.day);
        newDay = days[(currentIndex + daysToAdd) % 7];
        newDayCount += daysToAdd;
      }

      return {
        ...prev,
        hours: newHours,
        minutes: newMinutes,
        day: newDay,
        dayCount: newDayCount,
      };
    });
  };

  const handleSleepSave = () => {
    const playerStats = {
      hunger: gameState.hunger,
      money: gameState.money,
      stamina: gameState.stamina,
      happy: gameState.happy,
      spiritual: gameState.spiritual,
    };
    const userId = localStorage.getItem("userId");

    const gameTime = {
      day: time.day,
      dayCount: time.dayCount,
      hours: time.hours,
      minutes: time.minutes,
    };

    // Gunakan state inventory langsung!
    saveOnSleep(
      playerStats,
      gameState.currentLocation,
      inventory, // <-- ini state, bukan array kosong
      gameTime
    );

    if (userId) {
      saveToFirebase(userId, {
        ...playerStats,
        currentLocation: gameState.currentLocation,
        inventory, // <-- ini state, bukan array kosong
        ...gameTime,
      });
    }
  };

  const goToLocation = (location) => {
    setGameState((prev) => ({ ...prev, currentLocation: location }));
    addMessage(`You went to the ${location}.`);
    addTime(30);
    // Reset character position when changing locations
    setCharacterPosition({ x: 50, y: 50 });
  };

  const performAction = (action) => {
    if (isSleeping) return;

    switch (action) {
      case "sleep":
        if (gameState.stamina >= 100) {
          addMessage("You're not tired enough to sleep.");
          return;
        }
        setIsSleeping(true);
        setShowGameContent(false);
        handleSleepSave(); // Simpan progress saat tidur
        break;

      case "playGame":
        if (gameState.stamina < 25 || gameState.hunger < 30) {
          addMessage("You don't have enough stamina/hunger");
          return;
        }
        updateStats({ happy: 15, stamina: -25, hunger: -20 });
        addMessage("You played games for 2 hours. Happy +15, Stamina -25, Hunger -20");
        addTime(120); // Add 2 hours of game time
        break;

      case "eat":
        if (gameState.hunger >= 85) {
          addMessage("You're full");
          return;
        }
        updateStats({ hunger: 20 });
        addMessage("You ate some food. Hunger +20");
        addTime(30); // Add 30 minutes for eating
        break;
    }
  };

  const handleSleepComplete = useCallback(() => {
    if (!isSleeping) return;

    const currentHour = time.hours;
    let hoursToAdd = currentHour < 6 ? 6 - currentHour : 24 - currentHour + 6;
    addTime(hoursToAdd * 60);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const newDayIndex = (days.indexOf(time.day) + 1) % 7;
    const newDayCount = time.dayCount + 1;

    setTime({
      ...time,
      hours: 6,
      minutes: 0,
      day: days[newDayIndex],
      dayCount: newDayCount,
    });

    updateStats({
      stamina: 100,
      hunger: Math.max(gameState.hunger - 20, 0),
    });

    addMessage(`You slept until morning. Stamina fully restored! Day ${newDayCount} - ${days[newDayIndex]}`);
    setIsSleeping(false);
    setShowGameContent(true);
  }, [isSleeping, time, gameState.hunger]);

  const handleFastForward = () => {
    if (fastForwardRemaining <= 0) {
      addMessage("No fast forwards left!");
      return;
    }
    setShowFastForwardConfirm(true);
  };

  const confirmFastForward = () => {
    setFastForwardRemaining((prev) => prev - 1);
    updateStats({
      hunger: 30,
      money: 30,
      stamina: 30,
      happy: 30,
      spiritual: 30,
    });
    addTime(60);
    addMessage("Time fast forwarded! Stats increased.");
    setShowFastForwardConfirm(false);
  };

  const cancelFastForward = () => {
    setShowFastForwardConfirm(false);
  };

  const toggleMap = () => {
    setMapState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleMapMovement = (e) => {
    if (!mapState.isOpen) return;
    const key = e.key.toLowerCase();
    const moveAmount = 2;
    let newX = mapState.avatarPosition.x;
    let newY = mapState.avatarPosition.y;

    if (["w", "a", "s", "d", "e"].includes(key)) {
      e.preventDefault();
      switch (key) {
        case "w":
          newY = Math.max(5, newY - moveAmount);
          break;
        case "a":
          newX = Math.max(5, newX - moveAmount);
          break;
        case "s":
          newY = Math.min(95, newY + moveAmount);
          break;
        case "d":
          newX = Math.min(95, newX + moveAmount);
          break;
        case "e":
          selectMapLocation();
          return;
      }
      setMapState((prev) => ({
        ...prev,
        avatarPosition: { x: newX, y: newY },
      }));
    }
  };

  const selectMapLocation = () => {
    const locations = [
      { name: "Home", x: 20, y: 40 },
      { name: "Travel", x: 70, y: 40 },
      { name: "Church", x: 70, y: 80 },
      { name: "Cafe", x: 40, y: 80 },
    ];
    let closestLocation = null;
    let minDistance = Infinity;

    locations.forEach((loc) => {
      const distance = Math.sqrt(Math.pow(mapState.avatarPosition.x - loc.x, 2) + Math.pow(mapState.avatarPosition.y - loc.y, 2));
      if (distance < 15 && distance < minDistance) {
        closestLocation = loc.name;
        minDistance = distance;
      }
    });

    if (closestLocation) {
      toggleMap();
      goToLocation(closestLocation);
    }
  };

  const checkInteractiveAreas = useCallback(() => {
    if (mapState.isOpen || isSleeping) return;

    const charX = characterPosition.x;
    const charY = characterPosition.y;
    const proximityThreshold = 15;

    let nearestObject = null;
    let minDistance = Infinity;

    // Only check interactive areas for current location
    const currentLocationAreas = interactiveAreas[gameState.currentLocation] || {};

    Object.entries(currentLocationAreas).forEach(([key, area]) => {
      const areaCenterX = area.x + area.width / 2;
      const areaCenterY = area.y + area.height / 2;
      const distance = Math.sqrt(Math.pow(charX - areaCenterX, 2) + Math.pow(charY - areaCenterY, 2));

      if (distance < proximityThreshold && distance < minDistance) {
        minDistance = distance;
        nearestObject = area;
      }
    });

    setCurrentInteractiveObject(nearestObject);
  }, [characterPosition, gameState.currentLocation, mapState.isOpen, isSleeping]);

  const handleInteraction = (object) => {
    if (!object) return;

    switch (object.type) {
      case "door":
        goToLocation(object.target);
        break;
      case "tv":
        performAction("playGame");
        break;
      case "bed":
        performAction("sleep");
        break;
      case "table":
        performAction("eat");
        break;
      default:
        break;
    }
  };

  const handleCharacterMovement = (e) => {
    if (mapState.isOpen || isSleeping || isCollapsed) return; // Add isCollapsed check

    const key = e.key.toLowerCase();
    const moveAmount = 2;

    if (key === "e" && currentInteractiveObject) {
      e.preventDefault();
      handleInteraction(currentInteractiveObject);
      return;
    }

    if (key === "escape") {
      e.preventDefault();
      if (gameState.currentLocation !== "Home") {
        goToLocation("Home");
      }
      return;
    }

    let newX = characterPosition.x;
    let newY = characterPosition.y;
    let newDirection = characterDirection;

    switch (key) {
      case "arrowup":
      case "w":
        newY = Math.max(0, newY - moveAmount);
        newDirection = "up";
        break;
      case "arrowdown":
      case "s":
        newY = Math.min(100, newY + moveAmount);
        newDirection = "down";
        break;
      case "arrowleft":
      case "a":
        newX = Math.max(0, newX - moveAmount);
        newDirection = "left";
        break;
      case "arrowright":
      case "d":
        newX = Math.min(100, newX + moveAmount);
        newDirection = "right";
        break;
      default:
        return;
    }

    e.preventDefault();
    setCharacterPosition({ x: newX, y: newY });
    setCharacterDirection(newDirection);
    setIsMoving(true);
  };

  useEffect(() => {
    // Contoh: otomatis login saat halaman dimuat (bisa dihapus jika tidak ingin auto-login)
    // handleLoginTest();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "m") {
        e.preventDefault();
        toggleMap();
        return;
      }
      if (mapState.isOpen) {
        handleMapMovement(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mapState.isOpen, mapState.avatarPosition]);

  useEffect(() => {
    window.addEventListener("keydown", handleCharacterMovement);
    return () => window.removeEventListener("keydown", handleCharacterMovement);
  }, [mapState.isOpen, mapState.avatarPosition, characterPosition, characterDirection, currentInteractiveObject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let newMinutes = prev.minutes + 1;
        let newHours = prev.hours;
        let newDay = prev.day;
        let newDayCount = prev.dayCount;

        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours++;
        }

        if (newHours >= 24) {
          newHours = 0;
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          const currentIndex = days.indexOf(prev.day);
          newDay = days[(currentIndex + 1) % 7];
          newDayCount++;
        }

        return {
          ...prev,
          hours: newHours,
          minutes: newMinutes,
          day: newDay,
          dayCount: newDayCount,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("playerName");
    if (!name) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const character = JSON.parse(localStorage.getItem("selectedCharacter"));
    if (!character) window.location.href = "/";
  }, []);

  useEffect(() => {
    const locationContainer = document.querySelector(".location-container");
    if (locationContainer) {
      switch (gameState.currentLocation) {
        case "Home":
          locationContainer.style.backgroundImage = `url('${BackgroundPath.homeBg}')`;
          break;
        case "Bedroom":
          locationContainer.style.backgroundImage = `url('${BackgroundPath.bedroomBg}')`;
          break;
        case "Kitchen":
          locationContainer.style.backgroundImage = `url('${BackgroundPath.kitchenBg}')`;
          break;
        case "Church":
          locationContainer.style.backgroundImage = `url('${BackgroundPath.churchBg}')`;
          break;
        case "Cafe":
          locationContainer.style.backgroundImage = `url('${BackgroundPath.cafeBg}')`;
          break;
        default:
          locationContainer.style.backgroundImage = `url('${BackgroundPath.homeBg}')`;
      }
    }
  }, [gameState.currentLocation]);

  useEffect(() => {
    checkInteractiveAreas();
  }, [characterPosition, checkInteractiveAreas]);

  useEffect(() => {
    const directionIndex = spriteConfig.directions[characterDirection] || 0;
    const frameWidth = spriteConfig.width;

    setSpritePosition({
      x: -frameWidth * animationFrame,
      y: -spriteConfig.height * directionIndex,
    });
  }, [characterDirection, animationFrame]);

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % spriteConfig.frames);
    }, 150);

    const timeout = setTimeout(() => setIsMoving(false), 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isMoving]);

  // Ganti useEffect load progress localStorage dengan versi loadProgress
  useEffect(() => {
    const savedProgress = loadProgress?.();
    if (savedProgress) {
      setGameState((prev) => ({
        ...prev,
        hunger: savedProgress.hunger ?? prev.hunger,
        money: savedProgress.money ?? prev.money,
        stamina: savedProgress.stamina ?? prev.stamina,
        happy: savedProgress.happy ?? prev.happy,
        currentLocation: savedProgress.currentLocation ?? prev.currentLocation,
        spiritual: savedProgress.spiritual ?? prev.spiritual,
      }));

      setInventory(savedProgress.inventory ?? []); // <-- tambahkan baris ini

      // Lanjutkan hari ke hari berikutnya
      if (savedProgress.day && savedProgress.dayCount && typeof savedProgress.hours === "number" && typeof savedProgress.minutes === "number") {
        // Hitung hari berikutnya
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const currentIndex = days.indexOf(savedProgress.day);
        const nextDay = days[(currentIndex + 1) % 7];
        const nextDayCount = savedProgress.dayCount + 1;

        setTime({
          day: nextDay,
          dayCount: nextDayCount,
          hours: 6, // Mulai pagi
          minutes: 0,
        });
      }
    }
  }, []);

  // Modifikasi handleRestartGame untuk memastikan semua nilai status adalah angka
  const handleRestartGame = () => {
    // Reset game state dengan nilai numerik yang pasti
    setGameState({
      hunger: 50,
      money: 100,
      stamina: 100,
      happy: 50,
      spiritual: 0,
      currentLocation: "Home",
    });

    // Reset waktu ke awal
    setTime({
      day: "Monday",
      dayCount: 1,
      hours: 6,
      minutes: 29,
    });

    // Reset posisi karakter ke posisi spawn default
    setCharacterPosition({ x: 50, y: 50 });
    setCharacterDirection("down");
    setSpritePosition({ x: 0, y: 0 });

    // Reset inventory
    setInventory([]);

    // Reset status collapse dan game over
    setIsCollapsed(false);
    setShowGameOver(false);

    // Reset pesan
    setMessages(["> Welcome! Let's start your new adventure ♪(´▽｀)"]);

    // Reset dan play musik
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Reset map state
    setMapState({
      isOpen: false,
      avatarPosition: { x: 50, y: 50 },
      currentLocation: null,
    });

    // Reset fast forward remaining
    setFastForwardRemaining(3);
  };

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("playerProgress");
    localStorage.removeItem("userId");
    // Jika ada data lain yang ingin dihapus, tambahkan di sini
    navigate("/login");
  };

  // Fungsi untuk menandai objective selesai dan menambah pesan
  useEffect(() => {
    window.completeObjective = (id) => {
      setCompletedObjectives((prev) => {
        if (!prev.includes(id)) {
          let msg = id === 1 ? "You have successfully completed Objective 1!" : id === 2 ? "You have successfully completed Objective 2!" : "Objective completed!";
          addMessage(msg);
          return [...prev, id];
        }
        return prev;
      });
    };
  }, []);

  return (
    <>
      <div className="pixel-theme">
        <div className="game-container">
          <audio ref={audioRef} src="/assets/Song.mp3" autoPlay loop volume={1} />
          <audio
            ref={collapseAudioRef}
            src="/assets/collapse-sound.mp3" // Sesuaikan dengan path file sound effect
          />
          <SleepOverlay isSleeping={isSleeping} onAnimationComplete={handleSleepComplete} />
          <MapButton toggleMap={toggleMap} />
          <div
            className="fast-forward-button"
            onClick={handleFastForward}
            title={`Fast Forward (${fastForwardRemaining} left)`}
            style={{
              backgroundImage: "url('/assets/fastforward.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "transparent",
            }}
          ></div>
          <div className="settings-button" onClick={() => setShowSettings(true)} />
          <div className="game-header pixel-font">{gameState.currentLocation.toUpperCase()}</div>
          Welcome, {localStorage.getItem("playerName")}!
          <TimeDisplay day={time.day} dayCount={time.dayCount} time={getFormattedTime()} />
          <MapScreen isOpen={mapState.isOpen} toggleMap={toggleMap} mapAvatarPosition={mapState.avatarPosition} currentMapLocation={mapState.currentLocation} handleMapMovement={handleMapMovement} selectMapLocation={selectMapLocation} />
          <EventSystem gameState={gameState} time={time} updateStats={updateStats} addMessage={addMessage} goToLocation={goToLocation} />
          <StatDisplay {...gameState} />
          <div className="location-container">
            <div
              className={`character-sprite ${isCollapsed ? "collapsed" : ""}`}
              style={{
                position: "absolute",
                left: `${characterPosition.x}%`,
                top: `${characterPosition.y}%`,
                width: `135px`,
                height: `135px`,
                backgroundImage: `url('${localStorage.getItem("selectedCharacterImg") || "/assets/charmale.png"}')`,
                backgroundPosition: `${spritePosition.x}px ${spritePosition.y}px`,
                transition: "left 0.3s, top 0.3s",
                zIndex: 10,
                imageRendering: "pixelated",
                backgroundRepeat: "no-repeat",
                filter: isCollapsed ? "grayscale(100%) brightness(50%)" : "none",
                transform: isCollapsed ? "rotate(90deg)" : "none",
              }}
            />

            {currentInteractiveObject && (
              <div
                style={{
                  position: "absolute",
                  top: `${characterPosition.y - 10}%`,
                  left: `${characterPosition.x}%`,
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "5px",
                  borderRadius: "5px",
                  zIndex: 100,
                  pointerEvents: "none",
                }}
              >
                Press E to {currentInteractiveObject.type === "door" ? "enter" : "use"} {currentInteractiveObject.type}
              </div>
            )}

            {gameState.currentLocation === "Church" ? (
              <ChurchPage gameState={gameState} time={time} messages={messages} addMessage={addMessage} updateStats={updateStats} addTime={addTime} goToLocation={goToLocation} />
            ) : gameState.currentLocation === "Cafe" ? (
              <CafeSection gameState={gameState} time={time} messages={messages} addMessage={addMessage} updateStats={updateStats} addTime={addTime} goToLocation={goToLocation} />
            ) : gameState.currentLocation === "Travel" ? (
              <TravelPage gameState={gameState} time={time} messages={messages} addMessage={addMessage} updateStats={updateStats} addTime={addTime} goToLocation={goToLocation} />
            ) : gameState.currentLocation === "Japan" ? (
              <JapanPage gameState={gameState} time={time} messages={messages} addMessage={addMessage} updateStats={updateStats} addTime={addTime} goToLocation={goToLocation} setIsSleeping={setIsSleeping} />
            ) : gameState.currentLocation === "Singapore" ? (
              <SingaporePage gameState={gameState} time={time} messages={messages} addMessage={addMessage} updateStats={updateStats} addTime={addTime} goToLocation={goToLocation} setIsSleeping={setIsSleeping} />
            ) : (
              <LocationView currentLocation={gameState.currentLocation} goToLocation={goToLocation} performAction={performAction} addMessage={addMessage} messages={messages} />
            )}
          </div>
          <MessageLog messages={messages} />
          <Inventory gameState={gameState} updateUI={() => {}} addMessage={addMessage} inventory={inventory} setInventory={setInventory} />
          <div className="bag-button" onClick={() => window.toggleInventory && window.toggleInventory()}>
            <img src="/assets/bag.png" alt="Bag" />
          </div>
          <button className={`objectives-icon-btn${mapState.isOpen ? " dimmed" : ""}`} onClick={() => setShowObjectives(true)} title="Objectives" style={{ position: "absolute", top: 110, left: 130, zIndex: 1100 }}>
            <img src="./assets/objective.png" alt="Objectives" style={{ width: "100%", height: "100%", display: "block" }} />
          </button>
          {showObjectives && <Objectives completedObjectives={completedObjectives} onClose={() => setShowObjectives(false)} />}
          {showFastForwardConfirm && (
            <div className="confirmation-dialog">
              <p>Are you sure you want to fast forward?</p>
              <p>
                <strong>All stats will increase by 30!</strong>
              </p>
              <p>(Remaining: {fastForwardRemaining})</p>
              <button className="confirm-btn" onClick={confirmFastForward}>
                Yes
              </button>
              <button className="cancel-btn" onClick={cancelFastForward}>
                No
              </button>
            </div>
          )}
          {showGameOver && (
            <GameOver
              onRestart={handleRestartGame}
              stats={{
                money: gameState.money,
                happy: gameState.happy,
                spiritual: gameState.spiritual,
              }}
              time={{ dayCount: time.dayCount }}
            />
          )}
          {/* Tambahkan komponen Settings */}
          <Settings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            volume={volume}
            setVolume={setVolume}
            onRestart={handleRestartGame}
            audioRef={audioRef}
            onLogout={handleLogout} // <-- Tambahkan prop ini
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
