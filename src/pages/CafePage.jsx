import { useEffect } from 'react';
import Inventory from '../Inventory';


const CafeSection = ({ gameState, addMessage, updateStats, addTime, goToLocation }) => {
  const Work = () => {
    if (gameState.stamina < 10) {
      addMessage("You're too tired to Working.");
      return;
    }

    updateStats({ 
      happy: -15, 
      stamina: -30,
      money: 40,
    });
    addTime(45);
    addMessage("You spent time Working. Happy -15, Stamina -30, Money +40, Time +45 minutes");
  };

  const buycoffee = () => {
    if (gameState.money < 5) {
      addMessage("You don't have enough money to buy coffee.");
      return;
    }
    updateStats({ money: -5 });
    addTime(15);

    window.addItemToInventory &&
      window.addItemToInventory({
        id: "coffee",
        name: "Coffee",
        type: "consumable",
        image: "/assets/coffee_cup.png",
        description: "A hot cup of coffee. Right click to drink.",
        effect: "coffee",
        value: 1,
      });

    addMessage("You bought a coffee. Check your inventory.");
  };

  return (
    <div
      className="location-view cafe-view"
      style={{
        backgroundImage: "url('/assets/cafe.png')",
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
        <button className="action-btn" onClick={Work}>WORK</button>
        <button className="action-btn" onClick={buycoffee}>BUY COFFEE</button>
        <button className="action-btn secondary" onClick={() => goToLocation('Home')}>BACK</button>
      </div>
    </div>
  );
};

export default CafeSection;