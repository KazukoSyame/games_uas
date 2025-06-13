import React, { useState } from "react";
import "../styles/Objectives.css";

const OBJECTIVES = [
  {
    id: 1,
    text: "Masterpiece Builder: Assemble a Legendary Gundam!",
    description: "Unleash your creativity and engineering skills to build a legendary Gundam model kit. Only true heroes complete this challenge!",
  },
  {
    id: 2,
    text: "Manga Explorer: Dive Into an Epic Manga Adventure!",
    description: "Lose yourself in the pages of an epic manga. Imagination is your only limit—explore new worlds and stories!",
  },
];

const Objectives = ({ completedObjectives = [], onClose }) => {
  return (
    <div className="objectives-overlay">
      <div className="objectives-modal">
        <button className="objectives-close-btn" onClick={onClose}>
          X
        </button>
        <div className="objectives-title">Objectives</div>
        <ul className="objective-list">
          {OBJECTIVES.map((obj) => (
            <li key={obj.id} className={`objective-item${completedObjectives.includes(obj.id) ? " completed" : ""}`}>
              <span className={`objective-check${completedObjectives.includes(obj.id) ? " completed" : ""}`}>{completedObjectives.includes(obj.id) ? "✔" : ""}</span>
              <span>
                <strong>{obj.text}</strong>
                <div style={{ fontSize: "0.85rem", color: "#b2bec3", marginTop: 2 }}>{obj.description}</div>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Objectives;
