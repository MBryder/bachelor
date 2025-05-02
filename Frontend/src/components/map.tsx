import { Map, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { handleSubmit } from "../services/mapService";
import { fetchPlacesByBounds } from "../services/placesService";
import PopupMarker from "./popUpMarker";
import VisiblePlaces from "./visiblePlaces";
import Selectedbar from "./selectedPlaces";
import PlaceDetails from "./placeDetails";
import Filter from "./filter";
import { useUserLocation } from "../hooks/useUserLocation";
import { useAnimatedRoutePoint } from "../hooks/useAnimatedRoutePoint";
import type { FeatureCollection, Feature, Point } from "geojson";


function MapComponent({ setVisiblePlaces, visiblePlaces, selectedPlacesList, setSelectedPlacesList }: any) {
  const mapRef = useRef<any>(null);
  const [minCost, setMinCost] = useState<number | null>(null);
  const [route, setRoute] = useState<number[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<google.maps.LatLngLiteral[]>([]);
  const userLocation = useUserLocation();
  const [checked, setChecked] = useState(false);
  const [animatedPoint, setAnimatedPoint] = useState<[number, number] | null>(null);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState("");

  useAnimatedRoutePoint(routeCoordinates, setAnimatedPoint);

  const filteredVisiblePlaces = filterTypes.length > 0
    ? visiblePlaces.filter((place: any) =>
        place.properties?.details?.types?.some((type: string) => filterTypes.includes(type))
      )
    : visiblePlaces;

    const visiblePlacesGeoJSON: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: filteredVisiblePlaces.map((place: any): Feature<Point> => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: place.geometry.coordinates,
        },
        properties: {
          ...place.properties,
        },
      })),
    };

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
        placeId: "user-location",
        name: "Your Location",
      },
    };

    if (newChecked) {
      const alreadyAdded = selectedPlacesList.some(
        (place: any) => place?.properties?.placeId === "user-location"
      );
      if (!alreadyAdded) {
        setSelectedPlacesList([userLocationFeature, ...selectedPlacesList]);
      }
    } else {
      const updatedList = selectedPlacesList.filter(
        (place: any) => place?.properties?.placeId !== "user-location"
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

  const callSubmit = async (transportMode: string) => {
    await handleSubmit(
      selectedPlacesList,
      setRoute,
      setMinCost,
      setRouteCoordinates,
      transportMode
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
          mapStyle="https://api.maptiler.com/maps/bright/style.json?key=L0M8KVYaAAuKx695rSCS"
          >
          <div className="flex flex-row h-full w-full justify-between items-start">
            <div className="flex flex-row h-full w-full justify-start items-start">
              {showDetails !== "" ? (
                <PlaceDetails
                  setShowDetails={setShowDetails}
                  showDetails={showDetails}
                />
              ) : (
                <VisiblePlaces
                  visiblePlaces={visiblePlaces}
                  fetchPlaces={() => {
                    const bounds = mapRef.current?.getBounds();
                    if (bounds) {
                      fetchPlacesByBounds(bounds, setVisiblePlaces);
                    }
                  }}
                  setSelectedPlacesList={setSelectedPlacesList}
                />
              )}
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

          {/* Clustering source and layers */}
          <Source
            id="visible-places-cluster"
            type="geojson"
            data={visiblePlacesGeoJSON}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer
              id="clusters"
              type="circle"
              filter={["has", "point_count"]}
              paint={{
                "circle-color": [
                  "step",
                  ["get", "point_count"],
                  "#FFE07D",  // < 10
                  10, "#FFB347",  // >= 10
                  25, "#FF7F50"   // >= 25
                ],
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  15,
                  10, 20,
                  25, 30
                ],
              }}
            />

          <Layer
            id="cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-size": 12,
            }}
            paint={{
              "text-color": "#000",
            }}
          />


            <Layer
              id="unclustered-point"
              type="circle"
              filter={["!", ["has", "point_count"]]}
              paint={{
                "circle-color": "#FF5733",
                "circle-radius": 6,
              }}
            />
          </Source>

          {/* Selected Places Markers with Popup */}
          {selectedPlacesList.map((place: any) => (
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
            />
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
              <div className="bg-blue-600 rounded-full w-2 h-2" title="You are here" />
            </Marker>
          )}

          {/* Route Line */}
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

          {/* Animated Route Point */}
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
