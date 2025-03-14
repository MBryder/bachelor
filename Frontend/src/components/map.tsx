import { useLoadScript, GoogleMap, Marker} from "@react-google-maps/api";
import { useMemo, useState} from "react";
import { fetchPlaces } from "../utils/placesService";
import {
    handleFetchPlaces,
    handleAddPlace,
    isPlaceInList,
    getDefaultMarkerIcon,
    getSelectedMarkerIcon
} from "../utils/mapUtiles"
import { Toaster } from "react-hot-toast";
import PlacesList from "./placesList";
import PlaceInfoWindow from "./placeInfoWindow"

interface MapProps {
    setVisiblePlaces: (places: google.maps.places.PlaceResult[]) => void;
    visiblePlaces: google.maps.places.PlaceResult[];
}

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
    const [selectedPlacesList, setSelectedPlacesList] = useState<google.maps.places.PlaceResult[]>([]);

    const defaultMarkerIcon = getDefaultMarkerIcon(isLoaded);
    const selectedMarkerIcon = getSelectedMarkerIcon(isLoaded);

    const handleSubmit = () => {
        console.log("Submit button clicked", selectedPlacesList);
    };

    return (
        <div className="flex w-full h-full">
            <Toaster />

            <div className="w-3/4 h-full rounded-xl overflow-hidden">
                {!isLoaded ? (
                    <p>Loading Google Maps...</p>
                ) : (
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={center}
                        zoom={14}
                        options={{
                            mapTypeControl: false,
                            fullscreenControl: false,
                            streetViewControl: false,
                        }}
                        onLoad={(mapInstance) => setMap(mapInstance)}
                        onIdle={() => handleFetchPlaces(map, setVisiblePlaces, fetchPlaces)}
                    >
                        {visiblePlaces.length > 0 &&
                            visiblePlaces.map((place) =>
                                place.geometry?.location ? (
                                    <Marker
                                        key={place.place_id}
                                        position={{
                                            lat: place.geometry.location.lat(),
                                            lng: place.geometry.location.lng(),
                                        }}
                                        onClick={() => setSelectedPlace(place)}
                                        icon={isPlaceInList(place, selectedPlacesList) ? selectedMarkerIcon : defaultMarkerIcon}
                                    />
                                ) : null
                            )}

                        {/* Use the new PlaceInfoWindow component */}
                        <PlaceInfoWindow
                            selectedPlace={selectedPlace}
                            setSelectedPlace={setSelectedPlace}
                            isPlaceInList={(place) => isPlaceInList(place, selectedPlacesList)}
                            handleAddPlace={(place) => handleAddPlace(place, selectedPlacesList, setSelectedPlacesList)}
                        />
                    </GoogleMap>
                )}
            </div>

            {/* Using the refactored PlacesList component */}
            <PlacesList selectedPlacesList={selectedPlacesList} setSelectedPlacesList={setSelectedPlacesList} />

            <button
                onClick={handleSubmit}
                className="absolute bottom-4 right-4 px-6 py-3 bg-green-500 text-white font-bold rounded shadow-lg"
            >
                Submit
            </button>
        </div>
    );
}

export default Map;