import { Map, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { handleSubmit } from "../services/mapService";
import { fetchPlacesByBounds } from "../services/placesService";
import PopupMarker from "./popUpMarker";
import VisiblePlaces from "./visiblePlaces";
import Selectedbar from "./selectedPlaces";
import Filter from "./filter";
import { useUserLocation } from "../hooks/useUserLocation";
import { useAnimatedRoutePoint } from "../hooks/useAnimatedRoutePoint";
import type { FeatureCollection } from "geojson";
import { useSelectedPlaces } from "../context/SelectedPlacesContext";

function MapComponent({ setVisiblePlaces, visiblePlaces }: any) {
  const mapRef = useRef<any>(null);
  const [minCost, setMinCost] = useState<number | null>(null);
  const [route, setRoute] = useState<number[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<google.maps.LatLngLiteral[]>([]);
  const userLocation = useUserLocation();
  const [checked, setChecked] = useState(false);
  const [animatedPoint, setAnimatedPoint] = useState<[number, number] | null>(null);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");
  const [zoom, setZoom] = useState<number>(10);
  const { selectedPlacesList, setSelectedPlacesList,} = useSelectedPlaces();

  useAnimatedRoutePoint(routeCoordinates, setAnimatedPoint);

  const filteredVisiblePlaces = filterTypes.length > 0
    ? visiblePlaces.filter((place: any) =>
        place.details?.types?.some((type: string) => filterTypes.includes(type))
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
        placeId: "user-location",
        name: "Your Location",
      },
    };

    if (newChecked) {
      const alreadyAdded = selectedPlacesList.some(
        (place: any) => place?.placeId === "user-location"
      );
      if (!alreadyAdded) {
        setSelectedPlacesList([userLocationFeature, ...selectedPlacesList]);
      }
    } else {
      const updatedList = selectedPlacesList.filter(
        (place: any) => place?.placeId !== "user-location"
      );
      setSelectedPlacesList(updatedList);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleMapMove = () => {
      const bounds = map.getBounds();
      setZoom(map.getZoom());
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

  const clusterGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: filteredVisiblePlaces.map((place: any) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
      properties: {
        placeId: place.placeId,
      },
    })),
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
          {/* UI Panels */}
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
                setSelectedPlacesList={setSelectedPlacesList}
                showMoreDetails={showMoreDetails}
                setShowMoreDetails={setShowMoreDetails}
              />
              <Filter filterTypes={filterTypes} setFilterTypes={setFilterTypes} />
            </div>
            <Selectedbar
              Submit={callSubmit}
              handleChange={handleChange}
              visiblePlaces={visiblePlaces}
            />
          </div>

          {/* Show clusters only when zoom < 14 */}
          {zoom < 14 && (
            <Source
              id="cluster-source"
              type="geojson"
              data={clusterGeoJson}
              cluster={true}
              clusterMaxZoom={14}
              clusterRadius={90}
              
            >
              <Layer
                id="clusters"
                type="circle"
                filter={["has", "point_count"]}
                paint={{
                  "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#51bbd6",
                    10,
                    "#f1f075",
                    30,
                    "#f28cb1",
                  ],
                  "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    15,
                    10,
                    20,
                    30,
                    25,
                  ],
                }}
              />
              <Layer
                id="cluster-count"
                type="symbol"
                filter={["has", "point_count"]}
                layout={{
                  "text-field": "{point_count_abbreviated}",
                  "text-font": ["Open Sans Bold"],
                  "text-size": 12,
                }}
                paint={{
                  "text-color": "#000",
                }}
              />
            </Source>
          )}

          {/* Show all markers (selected + visible) only at zoom ≥ 14 */}
          {zoom >= 14 && [...selectedPlacesList, ...filteredVisiblePlaces.filter(
            (vp: any) =>
              !selectedPlacesList.some(
                (sp: any) => sp.placeId === vp.placeId
              )
          )].map((place: any) => {
            const placeId = place.placeId;
            const isSelected = selectedPlacesList.some(
              (sp: any) => sp.placeId === placeId
            );

            return (
              <PopupMarker
                key={placeId}
                longitude={place.longitude}
                latitude={place.latitude}
                title={place.name}
                image={
                  place.images?.[0]?.imageUrl ||
                  "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"
                }
                description={
                  place.details?.editorialOverview ||
                  "No description available."
                }
                setSelectedPlacesList={setSelectedPlacesList}
                place={place}
                color={isSelected ? "blue" : "red"}
                setShowMoreDetails={setShowMoreDetails}
              />
            );
          })}

          {/* User location */}
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
                  coordinates: routeCoordinates.map((coord) => [coord.lng, coord.lat]),
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
