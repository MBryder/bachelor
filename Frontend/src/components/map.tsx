import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
import { fetchPlaces } from "../utils/placesService";

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

const mapOptions = {
    mapTypeControl: false,       // Hides 'Kort' and 'Satellit'
    fullscreenControl: false,    // Hides fullscreen button
    streetViewControl: false,    // Hides Street View pegman
};

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY;
const libraries: ("places")[] = ["places"];

function Map({ setVisiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries,
    });

    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [localVisiblePlaces, setLocalVisiblePlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    const handleFetchPlaces = useCallback(() => {
        fetchPlaces(map, (places) => {
            setLocalVisiblePlaces(places);
            setVisiblePlaces(places);
        });
    }, [map, setVisiblePlaces]);

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
                    {localVisiblePlaces.length > 0 &&
                        localVisiblePlaces.map((place) => (
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
                                <img
                                    src={selectedPlace.photoUrl}
                                    alt={selectedPlace.name}
                                    className="w-full h-32 object-cover rounded-md"
                                />
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
