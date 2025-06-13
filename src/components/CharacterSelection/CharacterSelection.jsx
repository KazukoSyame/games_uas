import { useState, useEffect } from 'react';
import { getCharacters } from '../../services/characterService';
import './CharacterSelection.css';

const CharacterSelection = ({ onCharacterSelect }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await getCharacters();
        setCharacters(data);
        // Set karakter pertama sebagai default
        if (data.length > 0) {
          onCharacterSelect(data[0]);
        }
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };
    loadCharacters();
  }, [onCharacterSelect]);

// Update these functions in CharacterSelection.jsx
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