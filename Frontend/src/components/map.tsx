import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";

interface Place {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeUrl: string;
    type: string;
    photoUrl?: string;
}

interface MapProps {
    setVisiblePlaces: (places: Place[]) => void;
}

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY;
const libraries: ("places")[] = ["places"];

function Map({ setVisiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries,
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
        
        const entertainmentTypes = [
            "amusement_park",
            "aquarium",
            "art_gallery",
            "bowling_alley",
            "casino",
            "movie_theater",
            "museum",
            "night_club",
            "stadium",
            "tourist_attraction",
            "zoo",
        ];
    
        const searchPromises = entertainmentTypes.map((type) => 
            new Promise((resolve) => {
                service.nearbySearch({ bounds, type }, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results); // Directly resolve results without modifying them
                    } else {
                        resolve([]);
                    }
                });
            })
        )
    
        Promise.all(searchPromises).then((resultsArray) => {
            const combinedResults = resultsArray.flat();
            console.log(combinedResults);
            processResults(combinedResults as google.maps.places.PlaceResult[]);
        });
    }, [map, setVisiblePlaces]);

    

    const processResults = (results: google.maps.places.PlaceResult[] | null) => {
        if (!results) return;

        const places: Place[] = results.map((place) => ({
            id: place.place_id || "",
            name: place.name || "Unknown",
            address: place.vicinity || "No Address",
            lat: place.geometry?.location?.lat() ?? 0,
            lng: place.geometry?.location?.lng() ?? 0,
            placeUrl: place.place_id
                ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
                : "#",
            type: place.types?.[0] || "Unknown",
            photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }) || "https://via.placeholder.com/400"
        }));

        setLocalVisiblePlaces(places)
        setVisiblePlaces(places);
    };

    return (
        <div className="w-full h-full rounded-xl overflow-hidden">
            {!isLoaded ? (
                <p>Loading Google Maps...</p>
            ) : (
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={center}
                    zoom={14}
                    onLoad={(mapInstance) => setMap(mapInstance)}
                    onIdle={fetchPlaces}
                >
                    {visiblePlaces.length > 0 &&
                        visiblePlaces.map((place) => (
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
                                <img src={selectedPlace.photoUrl} alt={selectedPlace.name} className="w-full h-32 object-cover rounded-md" />
                                <h3 className="font-bold">{selectedPlace.name}</h3>
                                <p>{selectedPlace.address}</p>
                                <p className="italic">{selectedPlace.type}</p>
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
            )}
        </div>
    );
}

export default Map;
