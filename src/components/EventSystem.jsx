import React, { useEffect, useRef, useState } from "react";
import "../styles/EventSystem.css";

// Event definitions (migrated from your JS)
const events = [
  {
    id: "midnight_snack",
    title: "Midnight Snack",
    description: "You feel hungry in the middle of the night and raid the fridge.",
    conditions: {
      time: { min: 0, max: 4 },
      location: "Kitchen",
      stats: { hunger: { max: 70 } },
    },
    effects: { hunger: 20, happy: 5, stamina: -5 },
  },
  {
    id: "morning_jog",
    title: "Morning Jog",
    description: "You decide to go for a refreshing morning jog.",
    conditions: {
      time: { min: 6, max: 7 },
      location: "Home",
      stats: { stamina: { min: 30 } },
    },
    effects: { stamina: -15, happy: 10, hunger: -10, time: 80 },
  },
  {
    id: "lunch_time",
    title: "Lunch Time",
    description: "It's lunch time! You feel hungry.",
    conditions: {
      time: { min: 12, max: 13 },
      location: ["Kitchen", "Cafe"],
      stats: { hunger: { max: 80 } },
    },
    effects: { hunger: 30, stamina: 10 },
  },
  {
    id: "found_money",
    title: "Found Money",
    description: "You found some money on the ground!",
    conditions: {
      location: { exclude: "Home" },
      chance: 0.1,
    },
    effects: { money: 20 },
  },
  {
    id: "church_service",
    title: "Church Service",
    description: "You attend a Sunday service at the church.",
    conditions: {
      day: "Sunday",
      time: { min: 9, max: 11 },
      location: "Church",
    },
    effects: { spiritual: 30, happy: 15 },
  },
  {
    id: "shrine_visit",
    title: "Shrine Visit",
    description: "You feel a spiritual presence at the shrine.",
    conditions: {
      time: { min: 8, max: 18 },
      location: "Shrine",
    },
    effects: { spiritual: 25, stamina: -5 },
  },
  {
    id: "rush_hour",
    title: "Rush Hour",
    description: "You get stuck in traffic on your way home.",
    conditions: {
      time: { min: 17, max: 19 },
      location: "Home",
    },
    effects: { stamina: -15, happy: -10, time: 60 },
  },
  {
    id: "unexpected_bonus",
    title: "Unexpected Bonus",
    description: "Your boss appreciated your hard work this week and gave you a bonus!",
    conditions: {
      day: "Saturday",
      time: { min: 15, max: 17 },
      location: "Cafe",
      action: "work",
      stats: { stamina: { min: 40 } },
    },
    effects: { money: 50, happy: 10 },
  },
  {
    id: "late_night_warning",
    title: "Late Night Warning",
    description: "It's getting late! You should go home and sleep soon.",
    conditions: {
      time: { min: 22, max: 22 },
      location: { exclude: "Bedroom" },
    },
    effects: {},
  },
  {
    id: "fainted_from_exhaustion",
    title: "Fainted from Exhaustion",
    description: "You stayed up too late and collapsed from exhaustion! Someone brought you to bed.",
    conditions: {
      time: { min: 0, max: 5 },
      location: { exclude: "Bedroom" },
    },
    effects: { stamina: -30, happy: -15, hunger: -20 },
  },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function checkEventConditions(event, { time, day, location, stats, action }) {
  // Day
  if (event.conditions.day) {
    if (Array.isArray(event.conditions.day)) {
      if (!event.conditions.day.includes(day)) return false;
    } else if (day !== event.conditions.day) {
      return false;
    }
  }
  // Time
  if (event.conditions.time) {
    if (time < event.conditions.time.min || time > event.conditions.time.max) return false;
  }
  // Location
  if (event.conditions.location) {
    if (Array.isArray(event.conditions.location)) {
      if (!event.conditions.location.includes(location)) return false;
    } else if (typeof event.conditions.location === "object" && event.conditions.location.exclude) {
      if (location === event.conditions.location.exclude) return false;
    } else if (location !== event.conditions.location) {
      return false;
    }
  }
  // Stats
  if (event.conditions.stats) {
    for (const stat in event.conditions.stats) {
      const cond = event.conditions.stats[stat];
      const value = stats[stat];
      if (cond.min !== undefined && value < cond.min) return false;
      if (cond.max !== undefined && value > cond.max) return false;
    }
  }
  // Action
  if (event.conditions.action && event.conditions.action !== action) return false;
  // Chance
  if (event.conditions.chance && Math.random() > event.conditions.chance) return false;
  return true;
}

function getCurrentEventContext(gameState, time, action) {
  return {
    time: time.hours,
    day: time.day,
    location: gameState.currentLocation,
    stats: gameState,
    action,
  };
}

const EventSystem = ({ gameState, time, updateStats, addMessage, goToLocation, onFaint, action }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [startTime, setStartTime] = useState(Date.now()); // Tambahkan state untuk waktu mulai
  const faintTimeoutRef = useRef();

  // Helper: apply event effects
  const applyEventEffects = (event) => {
    let statChanges = {};
    for (const stat in event.effects) {
      if (stat === "time") {
        if (typeof updateStats === "function") {
          updateStats({}); // Let parent handle time
        }
      } else {
        statChanges[stat] = event.effects[stat];
      }
    }
    if (Object.keys(statChanges).length > 0) {
      updateStats(statChanges);
    }
  };

  // Show event popup and apply effects
  const triggerEvent = (event) => {
    applyEventEffects(event);
    setActiveEvent(event);
    // Special logic for fainting, but use standard modal
    if (event.id === "fainted_from_exhaustion") {
      if (typeof goToLocation === "function") goToLocation("Bedroom");
      if (typeof onFaint === "function") onFaint();
    }
    setShowPopup(true);
    if (typeof addMessage === "function") {
      const statsText = Object.entries(event.effects)
        .map(([key, value]) => `${key.toUpperCase()} ${value > 0 ? "+" : ""}${value}`)
        .join(", ");
      addMessage(`[EVENT] ${event.description}${statsText ? ` (${statsText})` : ""}`);
    }
  };

  // Prevent event on first mount
  useEffect(() => {
    setJustStarted(true);
    setStartTime(Date.now()); // Set waktu mulai saat komponen mount
    const timer = setTimeout(() => setJustStarted(false), 2000); // 2 detik aman setelah start
    return () => clearTimeout(timer);
  }, []);

  // Check for events periodically (every 5 minutes game time, simulated as 10s real time for demo)
  useEffect(() => {
    if (justStarted) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const ctx = getCurrentEventContext(gameState, time, action);
        const qualified = events.filter((e) => {
          // Tambahkan delay khusus untuk morning_jog
          if (e.id === "morning_jog") {
            if (Date.now() - startTime < 8000) return false;
          }
          return checkEventConditions(e, ctx);
        });
        if (qualified.length > 0) {
          const event = qualified[Math.floor(Math.random() * qualified.length)];
          triggerEvent(event);
        }
      }
    }, 10000); // 10s for demo, change to 300000 for 5min
    return () => clearInterval(interval);
  }, [gameState, time, action, justStarted, startTime]);

  // Also check on location change, tapi skip morning_jog jika belum 8 detik
  useEffect(() => {
    if (justStarted) return;
    const ctx = getCurrentEventContext(gameState, time, action);
    const qualified = events.filter((e) => {
      if (e.id === "morning_jog") {
        if (Date.now() - startTime < 8000) return false;
      }
      return checkEventConditions(e, ctx);
    });
    if (qualified.length > 0) {
      setTimeout(() => {
        const event = qualified[Math.floor(Math.random() * qualified.length)];
        triggerEvent(event);
      }, 500);
    }
    // eslint-disable-next-line
  }, [gameState.currentLocation, justStarted, startTime]);

  // Check for late night warning and fainting every minute, skip on first mount
  useEffect(() => {
    if (justStarted) return;
    const checkTimeConditions = () => {
      const ctx = getCurrentEventContext(gameState, time, action);
      // Late night warning
      const warning = events.find((e) => e.id === "late_night_warning");
      if (warning && checkEventConditions(warning, ctx)) {
        triggerEvent(warning);
      }
      // Fainting
      const faint = events.find((e) => e.id === "fainted_from_exhaustion");
      if (faint && checkEventConditions(faint, ctx)) {
        triggerEvent(faint);
      }
    };
    const interval = setInterval(checkTimeConditions, 60000);
    return () => clearInterval(interval);
  }, [gameState, time, action, justStarted]);

  // Popup close handler
  const closePopup = () => {
    setShowPopup(false);
    setActiveEvent(null);
  };

  // Popup UI
  return (
    <>
      {showPopup && activeEvent && (
        <>
          <div className="overlay" />
          <div className="event-window">
            <div className="event-content">
              <h3>{activeEvent.title}</h3>
              <p>{activeEvent.description}</p>
              {Object.keys(activeEvent.effects).length > 0 && (
                <div className="event-popup-stats">
                  {Object.entries(activeEvent.effects)
                    .filter(([key]) => key !== "time")
                    .map(([key, value]) => (
                      <div key={key} className={value < 0 ? "negative" : ""}>
                        {key.toUpperCase()} {value > 0 ? "+" : ""}
                        {value}
                      </div>
                    ))}
                </div>
              )}
              <button className="event-close-btn" onClick={closePopup}>
                OK
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EventSystem;
