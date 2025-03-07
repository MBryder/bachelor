import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
import { fetchPlaces } from "../utils/placesService";
import Sidebar from "../components/Sidebar";
import { handleDeletePlace } from "../components/PlaceItem";
import DuplicatePlaceModal from "../components/DuplicatePlaceModel";


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
const libraries: ("places")[] = ["places"];

function Map({ setVisiblePlaces, visiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries,
    });

    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [selectedPlaces, setSelectedPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [duplicatePlace, setDuplicatePlace] = useState<google.maps.places.PlaceResult | null>(null);

    const handleFetchPlaces = useCallback(() => {
        fetchPlaces(map, (places) => {
            setVisiblePlaces(places);
        });
    }, [map, setVisiblePlaces]);

    const handleAddPlace = (place: google.maps.places.PlaceResult) => {
        if (selectedPlaces.some((p) => p.place_id === place.place_id)) {
            setDuplicatePlace(place);
            setShowModal(true);
        } else {
            setSelectedPlaces((prevSelectedPlaces) => [...prevSelectedPlaces, place]);
        }
    };

    const handleConfirmAddPlace = () => {
        if (duplicatePlace) {
            setSelectedPlaces((prevSelectedPlaces) => [...prevSelectedPlaces, duplicatePlace]);
            setDuplicatePlace(null);
            setShowModal(false);
        }
    };

    const handleCancelAddPlace = () => {
        setDuplicatePlace(null);
        setShowModal(false);
    };

    return (
        <div className="flex w-full h-full">
            <div className="w-3/4 h-full rounded-xl overflow-hidden">
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
                                place.geometry?.location && (
                                    <Marker
                                        key={place.place_id}
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
                                    <button
                                        onClick={() => handleAddPlace(selectedPlace)}
                                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                )}
            </div>

            <Sidebar
                selectedPlaces={selectedPlaces}
                setSelectedPlaces={setSelectedPlaces}
                handleDeletePlace={handleDeletePlace}
            />

            <DuplicatePlaceModal
                showModal={showModal}
                handleCancelAddPlace={handleCancelAddPlace}
                handleConfirmAddPlace={handleConfirmAddPlace}
            />
        </div>
    );
}

export default Map;