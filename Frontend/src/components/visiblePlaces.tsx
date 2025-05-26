import { useState, useRef, useEffect } from "react";
import { useFlyToLocation } from "../utils/flyTo";
import PopupMarker from "./popUpMarker";
import DefaultedCard from "./PlacesCards/DefaultedCard";
import DetailedCard from "./PlacesCards/DetailedCard";

function VisiblePlaces({
  visiblePlaces,
  fetchPlaces,
  showMoreDetails,
  setShowMoreDetails,
  setSelectedPlacesList,
}: {
  visiblePlaces: any[];
  fetchPlaces: () => void;
  showMoreDetails: string;
  setShowMoreDetails: (placeId: string) => void;
  setSelectedPlacesList: (fn: (prev: any[]) => any[]) => void;
}) {
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const flyToLocation = useFlyToLocation(); // Use the hook!
  const refMap = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handlePlaceClick = (place: any) => {
    flyToLocation(place.longitude, place.latitude);
    setShowMoreDetails(place.placeId); 
  };

  useEffect(() => {
    if (showMoreDetails && refMap.current[showMoreDetails]) {
      refMap.current[showMoreDetails]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showMoreDetails]);

  return (
    <div className="h-full flex items-center py-2 z-10">
      <div className="h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex">
        <div className="h-full w-full flex flex-col">
          <h1 className="text-heading-1 h-[60px] py-2 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Visible places
          </h1>
          <ul className="px-2 overflow-y-auto flex-[14] scrollbar">
            {visiblePlaces.map((place: any) => {
              const isHovered = hoveredPlaceId === place.placeId;
              const placeId = place.placeId;

              return (
                <div
                  key={placeId}
                  ref={(el) => {
                    refMap.current[placeId] = el;
                  }}
                >
                  {showMoreDetails === placeId ? (
                    <DetailedCard
                      place={place}
                      setShowMoreDetails={setShowMoreDetails}
                    />
                  ) : (
                    <DefaultedCard
                      place={place}
                      onHover={setHoveredPlaceId}
                      onClick={() => handlePlaceClick(place)}
                      isHovered={isHovered}
                    />
                  )}

                  {(isHovered || showMoreDetails == placeId) && (
                    <PopupMarker
                      place={place}
                      color="orange"
                      titleON={true}
                    />
                  )}
                </div>
              );
            })}
          </ul>
          <div className="p-4 border-t-2 border-primary-brown flex items-center justify-center">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisiblePlaces;
