import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";


interface Place {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeUrl: string;
}

interface MapProps {
    setVisiblePlaces: (places: Place[]) => void;
}

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY;

function Map({ setVisiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries: ["places"], 
    });

    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [visiblePlaces, setLocalVisiblePlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    const fetchPlaces = useCallback(() => {
        if (!map) return;

        const bounds = map.getBounds();
        if (!bounds) return;

        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(
            {
                bounds,
                type: "point_of_interest", 
            },
            (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const places: Place[] = results.map((place: google.maps.places.PlaceResult) => ({
                        id: place.place_id || "",
                        name: place.name || "Unknown Place",
                        address: place.vicinity || "No Address",
                        lat: place.geometry?.location?.lat() ?? 0,
                        lng: place.geometry?.location?.lng() ?? 0,
                        placeUrl: place.place_id ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}` : "#",
                    }));

                    setLocalVisiblePlaces(places); 
                    setVisiblePlaces(places); 
                }
            }
        );
    }, [map, setVisiblePlaces]);

    const mapOptions = {
        mapTypeControl: false,       // Hides 'Kort' and 'Satellit'
        fullscreenControl: false,    // Hides fullscreen button
        streetViewControl: false,    // Hides Street View pegman
    };

    return (
        <div className="w-full h-full">
            {!isLoaded ? (
                <p>Loading Google Maps...</p>
            ) : (
                <div className="relative w-full h-full">
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={center}
                        zoom={14}
                        options={mapOptions}
                        onLoad={(mapInstance) => setMap(mapInstance)} 
                        onIdle={fetchPlaces}
                    >
                        {visiblePlaces.length > 0 &&
                            visiblePlaces.map((place: Place) => (
                                <Marker
                                    key={place.id}
                                    position={{ lat: place.lat, lng: place.lng }}
                                    onClick={() => setSelectedPlace(place)}
                                />
                            ))}

                        {selectedPlace && (
                            <InfoWindow
                                position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                                onCloseClick={() => setSelectedPlace(null)}
                            >
                                <div>
                                    <h3 className="font-bold">{selectedPlace.name}</h3>
                                    <p>{selectedPlace.address}</p>
                                    <a
                                        href={selectedPlace.placeUrl}
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
                    <div className="absolute flex flex-row top-4 left-4 transform w-[300px] max-w-md justify-between bg-background-beige3 rounded-3xl shadow-md">
                        <input
                            type="text"
                            placeholder="Search location..."
                            className="w-full p-2 px-4 text-paragraph-1 focus:outline-0 rounded-3xl"
                        />
                        
                            <p className="text-icon self-center px-4"><AiOutlineSearch/></p>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Map;
