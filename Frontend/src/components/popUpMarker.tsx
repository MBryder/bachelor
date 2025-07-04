import { Marker } from "@vis.gl/react-maplibre";
import { useState, useRef } from "react";
import CustomPopup from "./CustomPopup";
import { useFlyToLocation } from "../utils/flyTo";

const PopupMarker = ({
  place,
  titleON = false,
  setShowMoreDetails,
  color,
  openPopupPlaceId,
  setOpenPopupPlaceId,
}: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isOpen = openPopupPlaceId === place.placeId;
  const flyToLocation = useFlyToLocation(); // Use the hook!

  const handleClick = () => {
    if (!isOpen) {
      flyToLocation(place.longitude, place.latitude); // No need for map arg!
      setOpenPopupPlaceId(place.placeId);
    } else {
      setOpenPopupPlaceId(null);
    }
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
    setOpenPopupPlaceId(null);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Marker
        longitude={place.longitude}
        latitude={place.latitude}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <div className="relative flex flex-col items-center">
          <div className="h-4 mb-1 flex items-center justify-center">
            {titleON && !showPopup && (
              <div className="text-xs text-primary-brown bg-white px-1 rounded border-primary-brown border">
                {place.name}
              </div>
            )}
          </div>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color || "red" }}
          />
        </div>
      </Marker>

      {(showPopup || isOpen) && (
        <CustomPopup
          onClose={() => handlePopupClose()}
          place={place}
          setShowMoreDetails={setShowMoreDetails}
        />
      )}
    </div>
  );
};

export default PopupMarker;
