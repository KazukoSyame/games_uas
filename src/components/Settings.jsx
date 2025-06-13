import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = ({ 
  isOpen, 
  onClose, 
  volume, 
  setVolume, 
  onRestart,
  audioRef 
}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  if (!isOpen) return null;

  const renderVolumeSettings = () => (
    <div className="settings-content">
      <h3>Volume Settings</h3>
      <div className="volume-control">
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioRef.current) {
              audioRef.current.volume = newVolume;
            }
          }}
          className="volume-slider"
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
      <button className="back-button" onClick={() => setActiveMenu(null)}>Back</button>
    </div>
  );

  const renderCredits = () => (
    <div className="settings-content">
      <h3>Game Credits</h3>
      <div className="credits-scroll">
        <p className="credit-title">Life Simulation Game</p>
        <div className="credit-section">
          <h4>Developer</h4>
          <p>Andreas Rahardian</p>
          <p>NIM: 00000111047</p>
          <p>Andrew Reynard Hamdani</p>
          <p>NIM: 00000110585</p>
          <p>Farell Timothy</p>
          <p>NIM: 00000108839</p>
          <p>Vincent Anderson</p>
          <p>NIM: 00000110239</p>
        </div>
        <div className="credit-section">
          <h4>Art Assets</h4>
          <p>Pixel Art Andreas</p>
          <p>Background Andrew</p>
        </div>
        <div className="credit-section">
          <h4>Music</h4>
          <p>Background Music Andrew</p>
        </div>
        <div className="credit-section">
          <h4>Firewall Vincent</h4>
          <p>Poster Timo</p>
          <p>Game logic Andreas</p>
        </div>
      </div>
      <button className="back-button" onClick={() => setActiveMenu(null)}>Back</button>
    </div>
  );

  const renderRestartConfirm = () => (
    <div className="settings-content">
      <h3>Restart Game</h3>
      <p className="warning-text">Warning: This will reset all progress!</p>
      <div className="restart-buttons">
        <button 
          className="restart-confirm-button"
          onClick={() => {
            onRestart();
            onClose();
          }}
        >
          Yes, Restart Game
        </button>
        <button className="back-button" onClick={() => setActiveMenu(null)}>Cancel</button>
      </div>
    </div>
  );

  const renderMainMenu = () => (
    <div className="settings-main-menu">
      <h2 className="settings-title pixel-font">Settings</h2>
      <div className="settings-buttons">
        <button className="settings-option" onClick={() => setActiveMenu('volume')}>
          Volume Settings
        </button>
        <button className="settings-option" onClick={() => setActiveMenu('credits')}>
          Credits
        </button>
        <button className="settings-option warning" onClick={() => setActiveMenu('restart')}>
          Restart Game
        </button>
      </div>
      <button className="close-button pixel-font" onClick={onClose}>Close</button>
    </div>
  );

  return (
    <div className="settings-overlay">
      <div className="settings-dialog">
        {activeMenu === 'volume' && renderVolumeSettings()}
        {activeMenu === 'credits' && renderCredits()}
        {activeMenu === 'restart' && renderRestartConfirm()}
        {!activeMenu && renderMainMenu()}
      </div>
    </div>
  );
};

export default Settings;