import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
import { fetchPlaces } from "../utils/placesService";

interface MapProps {
    setVisiblePlaces: (places: google.maps.places.PlaceResult[]) => void;
    visiblePlaces: google.maps.places.PlaceResult[];
}

const mapOptions = {
    mapTypeControl: false,       // Hides 'Kort' and 'Satellit'
    fullscreenControl: false,    // Hides fullscreen button
    streetViewControl: false,    // Hides Street View pegman
};

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY;
const libraries: ("places")[] = ["places"];

function Map({ setVisiblePlaces, visiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries,
    });

    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    const handleFetchPlaces = useCallback(() => {
        fetchPlaces(map, (places) => {
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
                    {visiblePlaces.length > 0 &&
                        visiblePlaces.map((place) => (
                            place.geometry?.location && ( // Ensure location exists before rendering
                                <Marker
                                    key={place.place_id} // Use `place_id` instead of `id`
                                    position={{
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                    }}
                                    onClick={() => setSelectedPlace(place)}
                                />
                            )
                        ))
                    }


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
