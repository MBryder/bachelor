import { Map, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import PlacesList from "./placesList";
import { handleSubmit } from "../services/mapService";
import PopupMarker from "./popUpMarker";

function MapComponent({ setVisiblePlaces, visiblePlaces }: any) {
    const [selectedPlacesList, setSelectedPlacesList] = useState<any[]>([]);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [routeGeoJson, setRouteGeoJson] = useState<any>(null); // New: Store route data
    const mapRef = useRef<any>(null);
    const [minCost, setMinCost] = useState<number | null>(null);
    const [route, setRoute] = useState<number[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<google.maps.LatLngLiteral[]>([]);

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
                node["amenity"](${_sw.lat},${_sw.lng},${_ne.lat},${_ne.lng});
                node["leisure"](${_sw.lat},${_sw.lng},${_ne.lat},${_ne.lng});
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

            setGeoJsonData(geoJson);
            console.log("Fetched places:", geoJson.features);
            setVisiblePlaces(geoJson.features);

            // Extract places into a route
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
    
            <div className="w-3/4 h-full rounded-xl overflow-hidden relative">
                <Map
                    ref={mapRef}
                    initialViewState={{
                        longitude: 12.5939,
                        latitude: 55.6632,
                        zoom: 10,
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/bright"
                >
                    {/* Test marker at initialViewState */}
                    <PopupMarker
                        longitude={12.5939}
                        latitude={55.6632}
                        title="Initial Position"
                        image="https://source.unsplash.com/200x150/?landscape"
                        description="This is the initial position"
                        setSelectedPlacesList={setSelectedPlacesList}
                    />
    
                    {/* Add markers for each place */}
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
    
                    {/* Add GeoJSON markers */}

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
    
                    {/* Draw the route line */}
                    {routeGeoJson && (
                        <Source id="route" type="geojson" data={routeGeoJson}>
                            <Layer
                                id="route-layer"
                                type="line"
                                paint={{
                                    "line-color": "#1E90FF", // Blue line
                                    "line-width": 4,
                                    "line-opacity": 0.8,
                                }}
                            />
                        </Source>
                    )}
                </Map>
            </div>
    
            <PlacesList selectedPlacesList={selectedPlacesList} setSelectedPlacesList={setSelectedPlacesList} />
            <div className="absolute top-4 right-4 flex-col">
                {/* Buttons Container: Submit + Fetch */}
                <div className="flex space-x-4">
                    <div className="flex flex-col items-center">
                        <button
                            onClick={async () => await handleSubmit(selectedPlacesList, setRoute, setMinCost, setRouteCoordinates)}
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
        
                {/* Display Min Cost and Route */}
                {minCost !== null && (
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-700">Minimum Cost: {minCost}</p>
                        <p className="text-gray-600">Route: {route.join(" → ")}</p>
                    </div>
                )}
            </div>
        </div>
    );
    
}

export default MapComponent;
