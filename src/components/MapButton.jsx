import { useState } from "react";
import mapButtonIcon from "/assets/map_button.png";

const MapButton = ({ toggleMap }) => {
  return (
    <div id="mapButton" className="map-button" onClick={toggleMap}>
      <img src={mapButtonIcon} className="map-icon" alt="Map" />
    </div>
  );
};

export default MapButton;