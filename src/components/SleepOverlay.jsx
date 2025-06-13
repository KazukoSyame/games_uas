import React, { useEffect, useState } from 'react';
import '../styles/SleepOverlay.css';

const SleepOverlay = ({ isSleeping, onAnimationComplete }) => {
  const [visible, setVisible] = useState(false);
  const sleepSprite = localStorage.getItem("selectedCharacterSleepImg") || "/assets/femalesleep.png";

  useEffect(() => {
    if (isSleeping) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 1200); // Durasi animasi tidur
    }
  }, [isSleeping]);

  useEffect(() => {
    if (!visible && isSleeping) {
      const timeout = setTimeout(() => {
        onAnimationComplete && onAnimationComplete();
      }, 500); // Delay agar transisi selesai
      return () => clearTimeout(timeout);
    }
  }, [visible, isSleeping, onAnimationComplete]);

  return (
    <div className={`sleep-overlay${visible ? ' show' : ' hide'}`}>
      <div
        className="sleep-character"
        style={{ backgroundImage: `url('${sleepSprite}')` }}
      />
      <div className="sleep-text">Sleeping...</div>
    </div>
  );
};

export default SleepOverlay;
