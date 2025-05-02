import { Marker } from "@vis.gl/react-maplibre";
import { useState, useRef } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import CustomPopup from "./CustomPopup";
import { flyToLocation } from "../utils/flyTo"; // adjust path as needed

const PopupMarker = ({
  longitude,
  latitude,
  title,
  image,
  description,
  setSelectedPlacesList,
  place,
  color,
  titleON = false,
  setShowDetails,
  showDetails,
}: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { current: map } = useMap();

  const handleClick = () => {
    setShowDetails(place.properties.placeId);
    flyToLocation(map, longitude, latitude);
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopup(true);
      console.log("Popup shown for:", title);
    }, 500); // 1 second delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
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

      {(showPopup || showDetails === place.properties.placeId) && (
        <CustomPopup
          longitude={longitude}
          latitude={latitude}
          onClose={() => setShowDetails("")}
        >
          <h3 className="font-bold text-black text-lg">{title}</h3>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-24 object-cover rounded-lg mt-2"
            />
          )}
          {description && (
            <p className="text-gray-700 text-sm mt-2">{description}</p>
          )}
          <button
            className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-full"
            onClick={() =>
              setSelectedPlacesList?.((prevList: any[]) => [...prevList, place])
            }
          >
            Add to list
          </button>
        </CustomPopup>
      )}
    </div>
  );
};

export default PopupMarker;
