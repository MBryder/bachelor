import { useState, useRef, useEffect } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { flyToLocation } from "../utils/flyTo";
import PopupMarker from "./popUpMarker";
import DefaultedCard from "./PlacesCards/DefaultedCard";
import DetailedCard from "./PlacesCards/DetailedCard";

function VisiblePlaces({
  visiblePlaces,
  fetchPlaces,
  setSelectedPlacesList,
  selectedPlacesRef,
  showMoreDetails,
  setShowMoreDetails
}: {
  visiblePlaces: any[];
  fetchPlaces: () => void;
  showMoreDetails: string;
  setShowMoreDetails: (placeId: string) => void;
  setSelectedPlacesList: (fn: (prev: any[]) => any[]) => void;
  selectedPlacesRef: React.RefObject<any[]>;
}) {
  const { current: map } = useMap();
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  const refMap = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handlePlaceClick = (place: any) => {
    const [longitude, latitude] = place.geometry.coordinates;
    flyToLocation(map, longitude, latitude);
    setShowMoreDetails(place.properties.placeId);
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
          <h1 className="text-heading-1 flex-1 py-2 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Visible places
          </h1>
          <ul className="px-2 overflow-y-auto flex-[14] scrollbar">
            {visiblePlaces.map((place: any) => {
              const isHovered = hoveredPlaceId === place.properties.placeId;
              const placeId = place.properties.placeId;

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
                    setSelectedPlacesList={setSelectedPlacesList}
                    selectedPlacesRef={selectedPlacesRef}
                    setShowMoreDetails={setShowMoreDetails}
                    />
                  ) : (
                    <DefaultedCard
                      place={place}
                      onHover={setHoveredPlaceId}
                      onClick={() => handlePlaceClick(place)}
                      isHovered={isHovered}
                      setSelectedPlacesList={setSelectedPlacesList}
                      selectedPlacesRef={selectedPlacesRef}
                      showMoreDetails={showMoreDetails}
                    />
                  )}

                  {isHovered && (
                    <PopupMarker
                      key={`hover-marker-${placeId}`}
                      longitude={place.geometry.coordinates[0]}
                      latitude={place.geometry.coordinates[1]}
                      title={place.properties.name}
                      image={
                        place.properties.images?.[0]?.imageUrl ||
                        "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"
                      }
                      description={
                        place.properties.details?.editorialOverview ||
                        "No description available."
                      }
                      setSelectedPlacesList={setSelectedPlacesList}
                      place={place}
                      color="orange"
                      titleON={showMoreDetails !== placeId}
                    />
                  )}
                </div>
              );
            })}
          </ul>
          <div className="p-4 flex-1 border-t-2 border-primary-brown flex items-center justify-center">
            <button
              onClick={fetchPlaces}
              className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl h-full w-full"
            >
              <p className="text-primary-brown text-heading-3">Fetch Places</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisiblePlaces;
