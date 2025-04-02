import { Map, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import PlacesList from "./placesList";
import { handleSubmit } from "../services/mapService";
import PopupMarker from "./popUpMarker";
import Sidebar from "./sidebar";
import React from 'react';

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

    const handleChange = () => {
        const newChecked = !checked;
        setChecked(newChecked);
    
        if (!userLocation) {
            toast.error("User location not available yet.");
            return;
        }
    
        const userLocationFeature = {
            geometry: {
                coordinates: [userLocation.lng, userLocation.lat], // [lng, lat]
            },
            properties: {
                id: "user-location",
                name: "Your Location",
            },
        };
    
        if (newChecked) {
            // Add current location if not already in the list
            const alreadyAdded = selectedPlacesList.some(
                (place) => place?.properties?.id === "user-location"
            );
    
            if (!alreadyAdded) {
                setSelectedPlacesList([userLocationFeature, ...selectedPlacesList]);
            }
        } else {
            // Remove user location
            const updatedList = selectedPlacesList.filter(
                (place) => place?.properties?.id !== "user-location"
            );
            setSelectedPlacesList(updatedList);
        }
    };    
    

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

    const fetchPlaces = async () => {
        if (!mapRef.current) {
            toast.error("Map not loaded yet.");
            return;
        }

        const bounds = mapRef.current.getBounds();
        const { _sw, _ne } = bounds;

        const query = `
            [out:json];
            (
                node["tourism"](${_sw.lat},${_sw.lng},${_ne.lat},${_ne.lng});
            );
            out;
        `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const geoJson = {
                type: "FeatureCollection",
                features: data.elements
                    .filter((place: any) => place.tags?.name)
                    .map((place: any) => ({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [place.lon, place.lat],
                        },
                        properties: {
                            id: place.id,
                            name: place.tags.name,
                            ...place.tags,
                        },
                    })),
            };
            const uniqueTourism = Array.from(
                new Set(geoJson.features.map((feature: { properties: { tourism: string } }) => feature.properties.tourism))
              );

            console.log("Unique tourism", uniqueTourism);
            setGeoJsonData(geoJson);
            setVisiblePlaces(geoJson.features);

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
            console.error("Error fetching places:", error);
            toast.error("Failed to fetch places.");
        }
    };

    return (
        <div className="flex w-full h-full relative">
            <Toaster />

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
                    <Sidebar visiblePlaces={visiblePlaces}/>


                    {/* User GPS marker */}
                    {userLocation && (
                        <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
                            <div className="bg-blue-600 rounded-full w-4 h-4 border-2 border-white shadow-md" title="You are here" />
                        </Marker>
                    )}

                    {/* Markers for selected places */}
                    {selectedPlacesList.map((place) => (
                        <PopupMarker
                            key={place.properties.id}
                            longitude={place.geometry.coordinates[0]}
                            latitude={place.geometry.coordinates[1]}
                            title={place.properties.name}
                            image="https://source.unsplash.com/200x150/?landscape"
                            description="This is the initial position"
                            setSelectedPlacesList={setSelectedPlacesList}
                            place={place}
                        />
                    ))}

                    {/* Markers for visible places */}
                    {visiblePlaces?.map((place: any) => (
                        <PopupMarker
                            key={place.properties.id}
                            longitude={place.geometry.coordinates[0]}
                            latitude={place.geometry.coordinates[1]}
                            title={place.properties.name}
                            image="https://source.unsplash.com/200x150/?landscape"
                            description="This is the initial position"
                            setSelectedPlacesList={setSelectedPlacesList}
                            place={place}
                        />
                    ))}

                    {/* Circle layer */}
                    {geoJsonData && (
                        <Source id="places" type="geojson" data={geoJsonData}>
                            <Layer
                                id="places-layer"
                                type="circle"
                                paint={{
                                    "circle-radius": 6,
                                    "circle-color": "#FF5733",
                                    "circle-stroke-width": 2,
                                    "circle-stroke-color": "#fff",
                                }}
                            />
                        </Source>
                    )}

                    {/* Snapped route path */}
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
                                id="snapped-route-layer"
                                type="line"
                                paint={{
                                    "line-color": "#4CAF50",
                                    "line-width": 5,
                                    "line-opacity": 0.9,
                                }}
                            />
                        </Source>
                    )}
                    <div className="absolute top-4 right-4 flex-col">
                {/* Buttons */}
                <div className="flex space-x-4">
                    <div className="flex flex-col items-center">
                        <label>
                            <input
                            type="checkbox"
                            checked={checked}
                            onChange={handleChange}
                            />
                            Use current locations as starting point
                        </label>
                        <button
                            onClick={async () =>
                                await handleSubmit(
                                    selectedPlacesList,
                                    setRoute,
                                    setMinCost,
                                    setRouteCoordinates
                                )
                            }
                            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-lg transition"
                        >
                            Submit
                        </button>
                        {minCost === null && (
                            <p className="mt-2 text-sm text-gray-500">Click the button to solve TSP.</p>
                        )}
                    </div>

                    <button
                        onClick={fetchPlaces}
                        className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition"
                    >
                        Fetch Places
                    </button>
                </div>

                {/* Min Cost and Route Info */}
                {minCost !== null && (
                    <div className="bg-white p-4 mt-4 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-700">Minimum Cost: {minCost}</p>
                        <p className="text-gray-600">Route: {route.join(" → ")}</p>
                    </div>
                )}
            </div>

                </Map>
            </div>

            

            
        </div>
    );
}

export default MapComponent;
