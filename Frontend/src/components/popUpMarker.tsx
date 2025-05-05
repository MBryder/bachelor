import { Marker } from "@vis.gl/react-maplibre";
import { useState, useRef } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import CustomPopup from "./CustomPopup";
import { flyToLocation } from "../utils/flyTo";

const PopupMarker = ({
  longitude,
  latitude,
  title,
  setSelectedPlacesList,
  selectedPlacesRef,
  place,
  color,
  titleON = false,
  setShowMoreDetails,
}: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { current: map } = useMap();

  const handleClick = () => {
    flyToLocation(map, longitude, latitude);
    setKeepOpen(!keepOpen);
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPopup(false);
  };

  const handlePopupClose = () => {
    setKeepOpen(false);
    setShowPopup(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Marker
        longitude={longitude}
        latitude={latitude}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <div className="relative flex flex-col items-center">
          <div className="h-4 mb-1 flex items-center justify-center">
            {titleON && !showPopup && (
              <div className="text-xs text-primary-brown bg-white px-1 rounded border-primary-brown border">
                {title}
              </div>
            )}
          </div>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color || "red" }}
          />
        </div>
      </Marker>

      {(showPopup || keepOpen) && (
        <CustomPopup
          longitude={longitude}
          latitude={latitude}
          onClose={() => handlePopupClose()}
          place={place}
          setSelectedPlacesList={setSelectedPlacesList}
          selectedPlacesRef={selectedPlacesRef}
          setShowMoreDetails={setShowMoreDetails}
        />
      )}
    </div>
  );
};

export default PopupMarker;
