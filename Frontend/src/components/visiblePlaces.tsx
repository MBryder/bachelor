import { useState } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { flyToLocation } from "../utils/flyTo";
import PopupMarker from "./popUpMarker";

function VisiblePlaces({
  visiblePlaces,
  fetchPlaces,
  setSelectedPlacesList,
}: {
  visiblePlaces: any[];
  fetchPlaces: () => void;
  setSelectedPlacesList: (fn: (prev: any[]) => any[]) => void;
}) {
  const { current: map } = useMap();
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  const formatPlaceName = (name: string) => {
    // If it's one long word (no spaces) and ≥ 17 characters
    if (!name.includes(" ") && name.length >= 17) {
      return name.slice(0, 14) + "...";
    }
    return name;
  };

  return (
    <div className="h-full flex items-center py-2 z-10">
      <div
        className={`h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex`}
      >
        <div className="h-full w-full flex flex-col">
          <h1 className="text-heading-1 flex-1 py-2 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Visible places
          </h1>
          <ul className="px-2 overflow-y-auto flex-[14] scrollbar">
            {visiblePlaces.map((place: any) => {
              const isHovered = hoveredPlaceId === place.properties.placeId;
              const [longitude, latitude] = place.geometry.coordinates;

              return (
                <li
                  key={place.properties.placeId}
                  className="pb-2 py-2 border-b border-primary-brown flex hover:bg-background-beige2 cursor-pointer justify-between"
                  onMouseEnter={() => setHoveredPlaceId(place.properties.placeId)}
                  onMouseLeave={() => setHoveredPlaceId(null)}
                  onClick={() => flyToLocation(map, longitude, latitude)}
                >
                  <div className="flex flex-col h-full m-2">
                    <h2 className="text-primary-brown text-heading-3 break-words">
                      {formatPlaceName(place.properties.name)}
                    </h2>
                      {place.properties.rating != null && (
                        <div className="flex items-center gap-1">
                          <p className="text-sm">{place.properties.rating}</p>
                          <p className="text-sm text-yellow-500">
                            {"★".repeat(Math.round(place.properties.rating))}
                            <span className="text-gray-400">
                              {"★".repeat(5 - Math.round(place.properties.rating))}
                            </span>
                          </p>
                          <p className="">{`(${place.properties.userRatingsTotal})`}</p>
                        </div>
                      )}
                      <p>{place.properties.vicinity}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center h-full m-2">
                    <div className="w-24 aspect-square overflow-hidden">
                      <img
                        src={
                          place.properties.images?.[0]?.imageUrl ||
                          "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"
                        }
                        alt={place.properties.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <button className=" mt-2 w-20 h-6 border border-primary-brown bg-background-beige2 shadow-custom1 rounded-2xl"
                    onClick={() =>
                      setSelectedPlacesList?.((prevList: any[]) => [...prevList, place])
                    }> 
                    Add 
                    </button>
                  </div>
                  
                  

                  {isHovered && (
                    <PopupMarker
                      key={`hover-marker-${place.properties.placeId}`}
                      longitude={longitude}
                      latitude={latitude}
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
                      titleON={true} // Show title on hover
                    />
                  )}
                </li>
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
