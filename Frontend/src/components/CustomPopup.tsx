import { useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";

interface CustomPopupProps {
  longitude: number;
  latitude: number;
  onClose: () => void;
  place: any;
  setSelectedPlacesList: (fn: (prev: any[]) => any[]) => void;
  setShowMoreDetails: (placeId: string) => void;
}

const CustomPopup = ({
  longitude,
  latitude,
  onClose,
  place,
  setSelectedPlacesList,
  setShowMoreDetails
}: CustomPopupProps) => {
  const { current: map } = useMap();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const title = place.properties.name;
  const rating = place.properties.rating;
  const userRatingsTotal = place.properties.userRatingsTotal;
  const vicinity = place.properties.vicinity;

  const image =
    place.properties.images?.[0]?.imageUrl ||
    "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826";

  const formatPlaceName = (name: string) => {
    if (!name.includes(" ") && name.length >= 17) {
      return name.slice(0, 14) + "...";
    }
    return name;
  };

  useEffect(() => {
    if (!map) return;

    const updatePosition = () => {
      const { x, y } = map.project([longitude, latitude]);
      setPosition({ x, y });
    };

    updatePosition();
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [map, longitude, latitude]);

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
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>


        <div className="w-full p-2 flex justify-between">

          {/* Left: Text content */}
          <div className="flex flex-col flex-3/4 justify-start w-[60%]">
            <h2 className="text-primary-brown text-heading-3 break-words">
              {formatPlaceName(title)}
            </h2>

            {rating != null && (
              <div className="flex items-center gap-1">
                <p className="text-sm">{rating}</p>
                <p className="text-sm text-yellow-500">
                  {"★".repeat(Math.round(rating))}
                  <span className="text-gray-400">
                    {"★".repeat(5 - Math.round(rating))}
                  </span>
                </p>
                <p className="text-sm">{`(${userRatingsTotal})`}</p>
              </div>
            )}

            <p className="text-sm">{vicinity}</p>
          </div>

          {/* Right: Image and button */}
          <div className="flex flex-col items-center justify-center m-2 w-[40%]">
            <button
              className="mt-2 w-24 h-6 border border-primary-brown bg-background-beige1 shadow-custom1 rounded-2xl text-parafraph-1"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlacesList((prev: any[]) => {
                  const alreadyExists = prev.some(
                    (p) => p.properties.placeId === place.properties.placeId
                  );

                  if (alreadyExists) {
                    alert("This place is already in your route.");
                    return prev;
                  }

                  return [...prev, place];
                });
              }}
            >
              + Add
            </button>
            <button
              className="mt-2 w-24 h-6 border border-primary-brown bg-background-beige1 shadow-custom1 rounded-2xl text-parafraph-1"
              onClick={() => setShowMoreDetails(place.properties.placeId)}
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
