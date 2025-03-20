import { useLoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import { fetchPlaces } from "../utils/placesService";
import {
    handleFetchPlaces,
    handleAddPlace,
    isPlaceInList,
    getDefaultMarkerIcon,
    getSelectedMarkerIcon
} from "../utils/mapUtils";
import { Toaster } from "react-hot-toast";
import PlacesList from "./placesList";
import PlaceInfoWindow from "./placeInfoWindow";
import { handleSubmit } from "../services/mapService";

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

    const [minCost, setMinCost] = useState<number | null>(null);
    const [route, setRoute] = useState<number[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<google.maps.LatLngLiteral[]>([]);

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

                        <PlaceInfoWindow
                            selectedPlace={selectedPlace}
                            setSelectedPlace={setSelectedPlace}
                            isPlaceInList={(place) => isPlaceInList(place, selectedPlacesList)}
                            handleAddPlace={(place) => handleAddPlace(place, selectedPlacesList, setSelectedPlacesList)}
                        />

                        {routeCoordinates.length > 1 && (
                            <Polyline path={routeCoordinates} options={{ strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 3 }} />
                        )}
                    </GoogleMap>
                )}
            </div>

            <PlacesList selectedPlacesList={selectedPlacesList} setSelectedPlacesList={setSelectedPlacesList} />

            <button
                onClick={async () => await handleSubmit(selectedPlacesList, setRoute, setMinCost, setRouteCoordinates, map)}
                className="mt-4 p-2 bg-green-500 text-white rounded w-full"
            >
                Submit
            </button>

            {minCost !== null ? (
                <div>
                    <p>Minimum Cost: {minCost}</p>
                    <p>Route: {route.join(" → ")}</p>
                </div>
            ) : (
                <p>Click the button to solve TSP.</p>
            )}
        </div>
    );
}

export default Map;