import { Map, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { handleSubmit } from "../services/mapService";
import PopupMarker from "./popUpMarker";
import Sidebar from "./visiblePlaces";
import Selectedbar from "./selectedPlaces";
import React from 'react';
import { lineString, length, along } from "@turf/turf";

function MapComponent({ setVisiblePlaces, visiblePlaces }: any) {
    const [selectedPlacesList, setSelectedPlacesList] = useState<any[]>([]);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
    const mapRef = useRef<any>(null);
    const [minCost, setMinCost] = useState<number | null>(null);
    const [route, setRoute] = useState<number[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<google.maps.LatLngLiteral[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [checked, setChecked] = React.useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [animatedPoint, setAnimatedPoint] = useState<[number, number] | null>(null);

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

    // Animate dot along route
    useEffect(() => {
        if (routeCoordinates.length < 2) return;

        const line = lineString(routeCoordinates.map(coord => [coord.lng, coord.lat]));
        const totalDistance = length(line); // in km
        console.log("Total distance:", totalDistance, "km");
        const steps = totalDistance * 10; // Number of steps for animation
        let counter = 0;

        const interval = setInterval(() => {
            if (counter > steps) {
                clearInterval(interval);
                return;
            }

            const segment = along(line, (counter / steps) * totalDistance);
            setAnimatedPoint(segment.geometry.coordinates as [number, number]);
            counter++;
        }, 50);

        return () => clearInterval(interval);
    }, [routeCoordinates]);

    // Get current GPS location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    toast.success("Current location found!");
                },
                (error) => {
                    toast.error("Unable to retrieve location.");
                    console.error("Geolocation error:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            toast.error("Geolocation not supported in this browser.");
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        const handleMapMove = () => {
            fetchPlaces();
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

    const fetchPlaces = async () => {
        if (!mapRef.current) {
            toast.error("Map not loaded yet.");
            return;
        }

        const bounds = mapRef.current.getBounds();
        const { _sw, _ne } = bounds;

        const backendUrl = `http://localhost:5001/places/by-bounds?swLat=${_sw.lat}&swLng=${_sw.lng}&neLat=${_ne.lat}&neLng=${_ne.lng}`;

        try {
            const response = await fetch(backendUrl);
            const places = await response.json();

            const geoJson = {
                type: "FeatureCollection",
                features: places.map((place: any) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [place.longitude, place.latitude],
                    },
                    properties: {
                        id: place.id,
                        name: place.name,
                        rating: place.rating,
                        ...place
                    },
                })),
            };

            setGeoJsonData(geoJson);
            setVisiblePlaces(geoJson.features);
            console.log(geoJson.features);

            const routeGeoJSON = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: geoJson.features.map((place: any) => place.geometry.coordinates),
                        },
                        properties: {},
                    },
                ],
            };

            setRouteGeoJson(routeGeoJSON);
            toast.success(`Found ${geoJson.features.length} places!`);
        } catch (error) {
            console.error("Error querying places:", error);
            toast.error("Failed to fetch places from backend.");
        }
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
                    <div className="flex flex-row bg-amber-900 h-full w-full justify-end items-start">
                        <Sidebar
                            visiblePlaces={visiblePlaces}
                            fetchPlaces={fetchPlaces}
                            showSidebar={showSidebar}
                            setShowSidebar={setShowSidebar}
                        />
                        <Selectedbar
                            selectedPlaces={selectedPlacesList}
                            setSelectedPlacesList={setSelectedPlacesList}
                            Submit={callSubmit}
                            handleChange={handleChange}
                        />
                    </div>

                    {selectedPlacesList.map((place) => (
                        <PopupMarker
                            key={place.properties.id}
                            longitude={place.geometry.coordinates[0]}
                            latitude={place.geometry.coordinates[1]}
                            title={place.properties.name}
                            image={place.properties.images?.[0]?.imageUrl || "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"}
                            description="Description of this awesome place."
                            setSelectedPlacesList={setSelectedPlacesList}
                            place={place}
                            color="blue"
                            zindex={10}
                        />
                    ))}

                    {visiblePlaces?.map((place: any) => (
                        <PopupMarker
                            key={place.properties.id}
                            longitude={place.geometry.coordinates[0]}
                            latitude={place.geometry.coordinates[1]}
                            title={place.properties.name}
                            image={place.properties.images?.[0]?.imageUrl || "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"}
                            description="Description of this awesome place."
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

                    {/* Static route line */}
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

                    {/* Animated route point */}
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
