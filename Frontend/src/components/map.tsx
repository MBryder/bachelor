import { useLoadScript, GoogleMap, Marker, InfoWindow, Polyline } from "@react-google-maps/api";
import { useMemo, useState, useCallback, useEffect } from "react";
import { fetchPlaces } from "../utils/placesService";

interface MapProps {
    setVisiblePlaces: (places: google.maps.places.PlaceResult[]) => void;
    visiblePlaces: google.maps.places.PlaceResult[];
}

const mapOptions = {
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
};

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY;
const libraries: ("places" | "geometry")[] = ["places", "geometry"];


function Map({ setVisiblePlaces, visiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries, 
    });
    

    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [waypoints, setWaypoints] = useState<google.maps.LatLng[]>([]);
    const [routePolyline, setRoutePolyline] = useState<google.maps.LatLng[] | null>(null);

    const handleFetchPlaces = useCallback(() => {
        fetchPlaces(map, (places) => {
            setVisiblePlaces(places);
        });
    }, [map, setVisiblePlaces]);

    // Function to handle waypoint selection
    const handleSelectWaypoint = (place: google.maps.places.PlaceResult) => {
        if (!place.geometry || !place.geometry.location) return;

        const location = place.geometry.location;

        setWaypoints((prev) => {
            if (prev.length === 2) return [location]; // Reset if already two waypoints are selected
            return [...prev, location];
        });

        console.log("Selected waypoints:", waypoints);
    };
    

    const fetchRoute = async () => {
        if (waypoints.length !== 2) return;
    
        const apiKey = MAP_API_KEY;
        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline",
                },
                body: JSON.stringify({
                    origin: { location: { latLng: { latitude: waypoints[0].lat(), longitude: waypoints[0].lng() } } },
                    destination: { location: { latLng: { latitude: waypoints[1].lat(), longitude: waypoints[1].lng() } } },
                    travelMode: "DRIVE",
                    routingPreference: "TRAFFIC_AWARE",
                }),
            });
    
            const data = await response.json();
            console.log("Routes API Response:", data); // Debugging
    
            // Check if response contains polyline data
            if (!data.routes || data.routes.length === 0 || !data.routes[0].polyline || !data.routes[0].polyline.encodedPolyline) {
                console.error("No polyline found in API response.");
                return;
            }
    
            // Decode polyline safely
            const encodedPolyline = data.routes[0].polyline.encodedPolyline;
            if (window.google && window.google.maps && window.google.maps.geometry && window.google.maps.geometry.encoding) {
                const decodedPath = window.google.maps.geometry.encoding.decodePath(encodedPolyline);
                setRoutePolyline(decodedPath);
            } else {
                console.error("Google Maps geometry library is not loaded.");
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };
    

    // Fetch route when waypoints update
    useEffect(() => {
        if (waypoints.length === 2) {
            fetchRoute();
        }
    }, [waypoints]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden">
            {!isLoaded ? (
                <p>Loading Google Maps...</p>
            ) : (
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={center}
                    zoom={14}
                    options={mapOptions}
                    onLoad={(mapInstance) => setMap(mapInstance)}
                    onIdle={handleFetchPlaces}
                >
                    {visiblePlaces.map((place) => (
                        place.geometry?.location && (
                            <Marker
                                key={place.place_id}
                                position={{
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng(),
                                }}
                                onClick={() => handleSelectWaypoint(place)}
                            />
                        )
                    ))}

                    {/* Render the route polyline */}
                    {routePolyline && (
                        <Polyline
                            path={routePolyline}
                            options={{ strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 4 }}
                        />
                    )}

                    {selectedPlace && (
                        <InfoWindow
                            position={{
                                lat: selectedPlace.geometry?.location?.lat() || 0,
                                lng: selectedPlace.geometry?.location?.lng() || 0,
                            }}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div>
                                <img
                                    src={selectedPlace.photos?.[0]?.getUrl() || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                                    alt={selectedPlace.name}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                                <h3 className="font-bold">{selectedPlace.name}</h3>
                                <p>{selectedPlace.vicinity}</p>
                                <p className="italic">{selectedPlace.types?.[0]}</p>
                                <a
                                    href={selectedPlace.photos?.[0]?.getUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View on Google Maps
                                </a>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            )}
        </div>
    );
}

export default Map;
