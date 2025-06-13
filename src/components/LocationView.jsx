const LocationView = ({ currentLocation, goToLocation, performAction }) => {
  if (currentLocation === 'Cafe') {
    return null;
  }
  const getLocationBackground = () => {
    switch(currentLocation) {
      case "Bedroom":
        return "url('/assets/bedroom.jpg')";
      case "Kitchen":
        return "url('/assets/kitchen.jpg')";
      default:
        return "url('/assets/home.jpg')";
    }
  };

  return (
    <div 
      className="location-container"
      style={{ backgroundImage: getLocationBackground() }}
    >
      <div className="location-overlay">
        {currentLocation === "Home" && (
          <>
            <button onClick={() => goToLocation("Bedroom")}>BEDROOM</button>
            <button onClick={() => goToLocation("Kitchen")}>KITCHEN</button>
          </>
        )}
        
        {currentLocation === "Bedroom" && (
          <>
            <button onClick={() => performAction("sleep")}>SLEEP</button>
            <button onClick={() => performAction("playGame")}>GAMES</button>
            <button onClick={() => goToLocation("Home")}>BACK</button>
          </>
        )}
        
        {currentLocation === "Kitchen" && (
          <>
            <button onClick={() => performAction("eat")}>EAT</button>
            <button onClick={() => goToLocation("Home")}>BACK</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationView;