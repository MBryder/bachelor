// components/MapComponent.tsx
import { Map, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { handleSubmit } from "../services/mapService";
import { fetchPlacesByBounds} from "../services/placesService";
import PopupMarker from "./popUpMarker";
import VisiblePlaces from "./visiblePlaces";
import Selectedbar from "./selectedPlaces";
import Filter from "./filter";
import { useUserLocation } from "../hooks/useUserLocation";
import { useAnimatedRoutePoint } from "../hooks/useAnimatedRoutePoint";

function MapComponent({ setVisiblePlaces, visiblePlaces, selectedPlacesList, setSelectedPlacesList }: any) {
  const mapRef = useRef<any>(null);
  const [minCost, setMinCost] = useState<number | null>(null);
  const [route, setRoute] = useState<number[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<google.maps.LatLngLiteral[]>([]);
  const userLocation = useUserLocation();
  const [checked, setChecked] = useState(false);
  const [showvisiblePlaces, setShowvisiblePlaces] = useState(true);
  const [animatedPoint, setAnimatedPoint] = useState<[number, number] | null>(null);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  useAnimatedRoutePoint(routeCoordinates, setAnimatedPoint);

  const filteredVisiblePlaces = filterTypes.length > 0
    ? visiblePlaces.filter((place: any) =>
        place.properties?.details?.types?.some((type: string) => filterTypes.includes(type))
      )
    : visiblePlaces;

  const handleChange = (checked: boolean) => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (!userLocation) {
      toast.error("User location not available yet.");
      return;
    }

    const userLocationFeature = {
      geometry: {
        coordinates: [userLocation.lng, userLocation.lat],
      },
      properties: {
        id: "user-location",
        name: "Your Location",
      },
    };

    if (newChecked) {
      const alreadyAdded = selectedPlacesList.some(
        (place) => place?.properties?.id === "user-location"
      );
      if (!alreadyAdded) {
        setSelectedPlacesList([userLocationFeature, ...selectedPlacesList]);
      }
    } else {
      const updatedList = selectedPlacesList.filter(
        (place) => place?.properties?.id !== "user-location"
      );
      setSelectedPlacesList(updatedList);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handleMapMove = () => {
      const bounds = map.getBounds();
      fetchPlacesByBounds(bounds, setVisiblePlaces);
    };
    map.on("moveend", handleMapMove);
    return () => {
      map.off("moveend", handleMapMove);
    };
  }, [mapRef.current]);

  const callSubmit = async () => {
    await handleSubmit(
      selectedPlacesList,
      setRoute,
      setMinCost,
      setRouteCoordinates
    );
  };

  return (
    <div className="flex w-full h-full relative">
      <div className="w-full h-full rounded-xl overflow-hidden relative">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 12.5939,
            latitude: 55.6632,
            zoom: 10,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/bright"
        >
          <div className="flex flex-row h-full w-full justify-between items-start">
            <div className="flex flex-row h-full w-full justify-start items-start">
                <VisiblePlaces
                    visiblePlaces={visiblePlaces}

                    fetchPlaces={() => {
                    const bounds = mapRef.current?.getBounds();
                    if (bounds) {
                        fetchPlacesByBounds(bounds, setVisiblePlaces);
                    }
                    }}

                    showvisiblePlaces={showvisiblePlaces}
                    setShowvisiblePlaces={setShowvisiblePlaces}
                    setSelectedPlacesList={setSelectedPlacesList}
                />
                <Filter filterTypes={filterTypes} setFilterTypes={setFilterTypes} />
            </div>

            <Selectedbar
                selectedPlaces={selectedPlacesList}
                setSelectedPlacesList={setSelectedPlacesList}
                Submit={callSubmit}
                handleChange={handleChange} 
                visiblePlaces={visiblePlaces}                        
            />
          </div>

          {selectedPlacesList.map((place) => (
            <PopupMarker
              key={place.properties.placeId}
              longitude={place.geometry.coordinates[0]}
              latitude={place.geometry.coordinates[1]}
              title={place.properties.name}
              image={place.properties.images?.[0]?.imageUrl || "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"}
              description={place.properties.details?.editorialOverview || "No description available."}
              setSelectedPlacesList={setSelectedPlacesList}
              place={place}
              color="blue"
              zindex={10}
            />
          ))}

          {filteredVisiblePlaces?.map((place: any) => (
            <PopupMarker
              key={place.properties.placeId}
              longitude={place.geometry.coordinates[0]}
              latitude={place.geometry.coordinates[1]}
              title={place.properties.name}
              image={place.properties.images?.[0]?.imageUrl || "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"}
              description={place.properties.details?.editorialOverview || "No description available."}
              setSelectedPlacesList={setSelectedPlacesList}
              place={place}
              color="red"
            />
          ))}

          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
              <div className="bg-blue-600 rounded-full w-4 h-4 border-2 border-white shadow-md" title="You are here" />
            </Marker>
          )}

          {routeCoordinates.length > 1 && (
            <Source
              id="snapped-route"
              type="geojson"
              data={{
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates.map(coord => [coord.lng, coord.lat]),
                },
                properties: {},
              }}
            >
              <Layer
                id="snapped-route-line"
                type="line"
                paint={{
                  "line-width": 4,
                  "line-color": "purple",
                  "line-dasharray": [1, 3],
                  "line-opacity": 0.9,
                }}
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
              />
            </Source>
          )}

          {animatedPoint && (
            <Source
              id="route-point"
              type="geojson"
              data={{
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: animatedPoint,
                },
                properties: {},
              }}
            >
              <Layer
                id="route-point-layer"
                type="circle"
                paint={{
                  "circle-radius": 8,
                  "circle-color": "green",
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
}

export default MapComponent;
