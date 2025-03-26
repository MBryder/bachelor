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
    const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
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

            // build a default route from fetched places
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

            <div className="w-full h-full overflow-hidden relative">
                <Map
                    ref={mapRef}
                    initialViewState={{
                        longitude: 12.5939,
                        latitude: 55.6632,
                        zoom: 10,
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/bright"
                >
                    {/* Static marker */}
                    <PopupMarker
                        longitude={12.5939}
                        latitude={55.6632}
                        title="Initial Position"
                        image="https://source.unsplash.com/200x150/?landscape"
                        description="This is the initial position"
                        setSelectedPlacesList={setSelectedPlacesList}
                    />

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

                    {/* Circles on place locations */}
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

                    {routeCoordinates.length > 1 && (
                        <Source
                            id="snapped-route-display"
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
                                id="snapped-route-display-layer"
                                type="line"
                                paint={{
                                    "line-color": "#007AFF", // blue color
                                    "line-width": 4,
                                    "line-opacity": 0.9,
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
