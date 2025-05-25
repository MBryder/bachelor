import React from "react";
import { place } from "../../utils/types";
import { useFlyToLocation } from "../../utils/flyTo";

interface Props {
  selectedPlacesList: place[];
  handleSetAsStart: (index: number) => void;
  handleRemove: (index: number) => void;
  placesOrder: number[];
  routeCoordinates: {
    coordinates: { lat: number; lng: number }[];
    segments: any[];
  } | null;
}

const SelectedPlaceList: React.FC<Props> = ({
  selectedPlacesList,
  handleSetAsStart,
  handleRemove,
  placesOrder,
  routeCoordinates,
}) => {
  const flyToLocation = useFlyToLocation();

  // Choose what to render based on placesOrder
  let displayPlaces: { place: place; idx: number }[] = [];

  if (placesOrder.length === 0) {
    displayPlaces = selectedPlacesList.map((place, idx) => ({ place, idx }));
  } else {
    displayPlaces = placesOrder
      .slice(0, -1) // Exclude last element!
      .map((idx) => ({
        place: selectedPlacesList[idx],
        idx,
      }))
      .filter(({ place }) => !!place); // Only valid places
  }
  
  const formatPlaceName = (name: string) => {
    const words = name.split(" ");
    const hasLongWord = words.some((word) => word.length >= 15);

    if (hasLongWord) {
      return name.slice(0, 12) + "...";
    }

    return name;
  };

  return (
    <ul className="overflow-y-auto h-fit scrollbar flex-[9]">
      {displayPlaces.map(({ place, idx }, displayIndex) => (
        <div>
          <li
            key={idx}
            className="relative px-2 pt-2 mx-2 border-b flex items-center border-primary-brown hover:bg-background-beige2"
            onClick={() => flyToLocation(place.longitude, place.latitude)}
          >
            <div className="flex flex-1 items-center justify-between w-full">
              <div className="flex flex-col h-full m-2">
                <h2 className="text-primary-brown text-heading-3 break-words">
                  {formatPlaceName(place.name)}
                  {displayIndex === 0 && (
                    <span className="text-xs text-primary-brown/60 ml-1 italic">
                      (starting place)
                    </span>
                  )}
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
                    <p className="">{`(${place.userRatingsTotal})`}</p>
                  </div>
                )}
                <p>{place.vicinity}</p>
              </div>
              <div className="flex items-center gap-2">
                {displayIndex !== 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetAsStart(idx);
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Set as start
                  </button>
                )}
                <button
                  className="absolute top-2 right-2 text-sm hover:text-red-600 text-primary-brown"
                  onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                  }}
                  style={{ lineHeight: 1 }}
                  aria-label="Remove"
                >
                  X
                </button>
              </div>
            </div>
          </li>
          {displayIndex < displayPlaces.length &&
            routeCoordinates?.segments?.[displayIndex] && (
              <div className="border-b-1 border-primary-brown mx-2 flex items-center justify-between">
                <p className="text-primary-brown text-heading-5 px-6">
                  time:{" "}
                  {(() => {
                    const durationSec =
                      routeCoordinates.segments[displayIndex].duration;
                    const totalMinutes = Math.round(durationSec / 60);
                    if (totalMinutes >= 60) {
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
                    }
                    return `${totalMinutes} min`;
                  })()}
                </p>
                <p className="text-primary-brown text-heading-5 px-6">
                  Distance:{" "}
                  {`${(routeCoordinates.segments[displayIndex].distance / 1000).toFixed(1)} km`}
                </p>
              </div>
            )}
        </div>
      ))}
    </ul>
  );
};

export default SelectedPlaceList;
