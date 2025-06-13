import { useEffect, useState } from 'react';
import '../components/CharacterSprite.css';

const CharacterSprite = ({ character }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState('down');

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const moveAmount = 5;
      
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        
        let newX = position.x;
        let newY = position.y;
        let newDirection = direction;

        switch(key) {
          case 'w':
            newY = Math.max(0, position.y - moveAmount);
            newDirection = 'up';
            break;
          case 'a':
            newX = Math.max(0, position.x - moveAmount);
            newDirection = 'left';
            break;
          case 's':
            newY = Math.min(100, position.y + moveAmount);
            newDirection = 'down';
            break;
          case 'd':
            newX = Math.min(100, position.x + moveAmount);
            newDirection = 'right';
            break;
        }

        setPosition({ x: newX, y: newY });
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, direction]);

  if (!character) return null;

  return (
    <div 
      className={`character-sprite ${direction}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundImage: `url('${character.imageUrl}')`
      }}
    />
  );
};

export default CharacterSprite;