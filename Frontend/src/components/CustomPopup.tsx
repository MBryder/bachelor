import { useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";
import { place } from "../utils/types";
import { useAddToList, useRemoveFromList } from "../helper/updateList";
import { useInList } from "../helper/inList";

interface CustomPopupProps {
  onClose: () => void;
  place: place;
  setShowMoreDetails: (placeId: string) => void;
}

const CustomPopup = ({
  onClose,
  place,
  setShowMoreDetails
}: CustomPopupProps) => {
  const inList = useInList();
  const removeFromList = useRemoveFromList();
  const addToList = useAddToList();
  const { current: map } = useMap();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const formatPlaceName = (name: string) => {
    if (!name.includes(" ") && name.length >= 17) {
      return name.slice(0, 14) + "...";
    }
    return name;
  };

  useEffect(() => {
    if (!map) return;

    const updatePosition = () => {
      const { x, y } = map.project([place.longitude, place.latitude]);
      setPosition({ x, y });
    };

    updatePosition();
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [map, place.longitude, place.latitude]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div
        ref={popupRef}
        className="relative bg-background-beige2 border border-primary-brown rounded-2xl shadow-lg w-[300px] flex flex-col"
      >
        <div className="w-full aspect-video overflow-hidden ">
          <img
            src={place.images[0]?.imageUrl || "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"}
            alt={place.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>


        <div className="w-full p-2 flex justify-between">

          {/* Left: Text content */}
          <div className="flex flex-col flex-3/4 justify-start w-[60%]">
            <h2 className="text-primary-brown text-heading-3 break-words">
              {formatPlaceName(place.name)}
            </h2>

            {place.rating != null && (
              <div className="flex items-center gap-1">
                <p className="text-sm">{place.rating}</p>
                <p className="text-sm text-yellow-500">
                  {"★".repeat(Math.round(place.rating))}
                  <span className="text-gray-400">
                    {"★".repeat(5 - Math.round(place.rating))}
                  </span>
                </p>
                <p className="text-sm">{`(${place.userRatingsTotal})`}</p>
              </div>
            )}

            <p className="text-sm">{place.vicinity}</p>
          </div>

          {/* Right: Image and button */}
          <div className="flex flex-col items-center justify-center m-2 w-[40%]">
            {inList(place.placeId) ? (
              <button
                className="mt-2 w-24 h-6 border border-primary-brown bg-background-beige1 shadow-custom1 rounded-2xl text-parafraph-1"
                onClick={() => {
                  removeFromList(place.placeId);
                }}
              >
                - Remove
              </button>
            ) : (
              <button
                className="mt-2 w-24 h-6 border border-primary-brown bg-background-beige1 shadow-custom1 rounded-2xl text-parafraph-1"
                onClick={() => {
                  addToList(place);
                }}
              >
                + Add
              </button>
            )}
            
            <button
              className="mt-2 w-24 h-6 border border-primary-brown bg-background-beige1 shadow-custom1 rounded-2xl text-parafraph-1"
              onClick={() => setShowMoreDetails(place.placeId)}
            >
              More info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
