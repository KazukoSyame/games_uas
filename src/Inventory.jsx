import React, { useState, useEffect, useRef } from 'react';
import './styles/inventory.css';

function Inventory({ gameState, updateUI, addMessage, inventory, setInventory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'i') toggleInventory();
    };
    const handleClick = () => hideContextMenu();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const toggleInventory = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    window.addItemToInventory = (item) => {
      setInventory((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (i) => i.id === item.id && item.type === 'consumable' && i.quantity < 5
        );
        if (existingIndex !== -1) {
          const updated = [...prevItems];
          updated[existingIndex].quantity++;
          return updated;
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    };
    window.toggleInventory = toggleInventory;
  }, [setInventory]);

  const startDrag = (index) => setDraggedIndex(index);

  const dropItem = (index) => {
    if (draggedIndex === null) return;
    setInventory((prevItems) => {
      const updated = [...prevItems];
      const temp = updated[index];
      updated[index] = updated[draggedIndex];
      updated[draggedIndex] = temp;
      return updated;
    });
    setDraggedIndex(null);
  };

  const useItem = (index) => {
    const item = inventory[index];
    if (!item) return;

    const updatedItems = [...inventory];

    // Jika consumable, konsumsi
    if (item.type === 'consumable') {
      updatedItems[index].quantity--;
      if (updatedItems[index].quantity <= 0) updatedItems.splice(index, 1);
      setInventory(updatedItems);

      if (item.effect === 'hunger') {
        gameState.hunger = Math.min(gameState.hunger + (item.value || 10), 100);
        addMessage(`${item.name} eaten! Hunger +${item.value || 10}`);
      } else if (item.effect === 'coffee') {
        gameState.happy = Math.min((gameState.happy || 0) + 20, 100);
        gameState.stamina = Math.min((gameState.stamina || 0) + 15, 100);
        addMessage("You drank coffee! Happy +20, Stamina +15");
      }
    }

    // Jika usable, gunakan efek lalu hapus item
    if (item.type === 'usable') {
      window.useItemEffect?.(item);
      updatedItems.splice(index, 1); // langsung hilang
      setInventory(updatedItems);
    }

    updateUI();
    hideContextMenu();
  };

  const showContextMenu = (e, index) => {
    e.preventDefault && e.preventDefault(); // aman klik kanan/kiri
    setContextMenu({ x: e.clientX, y: e.clientY, index });
  };

  const hideContextMenu = () => setContextMenu(null);

  return (
    <>
      <div
        id="game-inventory"
        ref={containerRef}
        style={{ right: isOpen ? '0px' : '-300px' }}
      >
        <h2>Inventory ({inventory.length})</h2>
        <div className="item-grid">
          {inventory.map((item, index) => (
            <div
              key={index}
              className="item"
              draggable
              title={item.description || ''}
              onDragStart={() => startDrag(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropItem(index)}
              onContextMenu={(e) => showContextMenu(e, index)}
              onClick={(e) => showContextMenu(e, index)} // klik kiri juga buka context menu
            >
              {item.image && <img src={item.image} alt={item.name} />}
              <div>{item.name}</div>
              {item.quantity > 1 && <div className="quantity">{item.quantity}</div>}
            </div>
          ))}
        </div>
      </div>

      {contextMenu && (
        <div
          className="inventory-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button onClick={() => useItem(contextMenu.index)}>
            {inventory[contextMenu.index]?.type === 'usable' ? 'Use' : 'Consume'}
          </button>
        </div>
      )}
    </>
  );
}

export default Inventory;
