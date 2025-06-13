import mapBg from '/assets/map_bg.jpg';

<img src={mapBg} className="map-image" alt="Game Map" />

const MapScreen = ({ 
  isOpen, 
  toggleMap, 
  mapAvatarPosition,
}) => {
  if (!isOpen) return null;

  return (
    <div id="mapScreen" className="map-screen">
      <div className="map-container">
        <img src="/assets/map_bg.jpg" className="map-image" alt="Game Map" />
        <div 
          id="mapAvatar"
          className="map-avatar"
          style={{
            left: `${mapAvatarPosition.x}%`,
            top: `${mapAvatarPosition.y}%`
          }}
        ></div>
      </div>
      <div className="map-instructions">
        <p>Use WASD to move | E to select location | M to close map</p>
      </div>
    </div>
  );
};

export default MapScreen;