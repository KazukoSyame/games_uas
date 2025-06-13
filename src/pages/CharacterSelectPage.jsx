import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CharacterSelection from "../components/CharacterSelection/CharacterSelection";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const CharacterSelectPage = () => {
  const [playerName, setPlayerName] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (!selectedCharacter) {
      alert("Please select a character!");
      return;
    }

    // Simpan ke localStorage
    localStorage.setItem("selectedCharacter", JSON.stringify(selectedCharacter));
    localStorage.setItem("playerName", playerName.trim());

    // Set selectedCharacterImg sesuai gender
    if (selectedCharacter.gender === "female") {
  localStorage.setItem("selectedCharacterImg", "/assets/charfemale.png");
  localStorage.setItem("selectedCharacterSleepImg", "/assets/femalesleep.png"); // sesuai nama
} else {
  localStorage.setItem("selectedCharacterImg", "/assets/charmale.png");
  localStorage.setItem("selectedCharacterSleepImg", "/assets/malesleep.png"); // sesuai nama
}

    // Simpan ke Firestore
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          playerName: playerName.trim(),
          selectedCharacter: selectedCharacter,
        });
      } catch (e) {
        console.error("Failed to save character to Firestore", e);
      }
    }

    navigate("/home");
  };

  return (
    <div className="pixel-theme">
      <div className="selection-screen">
        <div style={{ textAlign: "center", marginBottom: "30px", fontSize: "0.95rem", color: "#f1c40f", fontStyle: "italic" }}>*for the best experience, play on fullscreen</div>
        <h1 className="title">SELECT YOUR CHARACTER</h1>

        <CharacterSelection onCharacterSelect={setSelectedCharacter} />

        <div className="input-group">
          <input type="text" className="pixel-input" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={20} placeholder="ENTER YOUR NAME" />
        </div>

        <button className="pixel-btn-start start-game-button" onClick={handleStartGame} disabled={!selectedCharacter}>
          START GAME
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectPage;
