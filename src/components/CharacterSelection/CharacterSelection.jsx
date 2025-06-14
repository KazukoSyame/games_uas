import { useState, useEffect } from 'react';
import './CharacterSelection.css';

const CharacterSelection = ({ onCharacterSelect }) => {
  const localCharacters = [
    {
      id: 1,
      imageUrl: '/assets/charmale.png',
      gender: 'male',
      name: 'Male Character',
    },
    {
      id: 2,
      imageUrl: '/assets/charfemale.png',
      gender: 'female',
      name: 'Female Character',
    },
  ];

  const [characters] = useState(localCharacters);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Select default character on load
    if (characters.length > 0) {
      onCharacterSelect(characters[0]);
    }
  }, [characters, onCharacterSelect]);

  const handlePrev = () => {
    const newIndex = (selectedIndex - 1 + characters.length) % characters.length;
    setSelectedIndex(newIndex);
    const selectedChar = characters[newIndex];
    onCharacterSelect(selectedChar);
    localStorage.setItem('selectedCharacterImg', selectedChar.gender === 'female' ? '/assets/charfemale.png' : '/assets/charmale.png');
  };

  const handleNext = () => {
    const newIndex = (selectedIndex + 1) % characters.length;
    setSelectedIndex(newIndex);
    const selectedChar = characters[newIndex];
    onCharacterSelect(selectedChar);
    localStorage.setItem('selectedCharacterImg', selectedChar.gender === 'female' ? '/assets/charfemale.png' : '/assets/charmale.png');
  };

  if (characters.length === 0) return <div className="loading">Loading characters...</div>;

  return (
    <div className="character-selection-container">
      <div className="character-carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img 
              src={characters[selectedIndex].imageUrl} 
              className="pixel-character" 
              alt={characters[selectedIndex].name} 
            />
            <p className="character-name">{characters[selectedIndex].name}</p>
          </div>
        </div>
        
        <div className="carousel-controls">
          <button className="carousel-control-prev" onClick={handlePrev}>
            ◀
          </button>
          <button className="carousel-control-next" onClick={handleNext}>
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;
