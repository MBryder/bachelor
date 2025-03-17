import { useLoadScript, GoogleMap, Marker} from "@react-google-maps/api";
import { useMemo, useState} from "react";
import { fetchPlaces } from "../utils/placesService";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast, { Toaster } from 'react-hot-toast';
import { getShortestPath, getDistanceMatrix } from "../services/mapService";

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


    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
    };

    const [minCost, setMinCost] = useState<number | null>(null);
    const [route, setRoute] = useState<number[]>([]);

    // SUBMIT TIL TSP ENDPOINT!
    const handleSubmit = async () => {
        console.log("Submit button clicked");
        console.log(selectedPlacesList);
        console.log(selectedPlacesList.length);

        const arrayOfGeo = selectedPlacesList.map(place => ({
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
        }));
        console.log(arrayOfGeo);

        try {
            const distances1 = await getDistanceMatrix(arrayOfGeo);

            const n = selectedPlacesList.length;
            console.log(distances1);
            console.log(n);

            const result = await getShortestPath(distances1, n);
            setRoute(result.route);
            setMinCost(result.minCost);
        } catch (error) {
            console.error("Error fetching shortest path:", error);
        }
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

            <div className="w-1/4 h-full p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Selected Places</h2>
                    <button
                        onClick={toggleDeleteMode}
                        className={`px-4 py-2 rounded ${isDeleteMode ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                        {isDeleteMode ? 'Arrange Mode' : 'Delete Mode'}
                    </button>
                </div>
    
                {isDeleteMode ? (
                    // Delete mode
                    <ul>
                        {selectedPlacesList.map((place, index) => (
                            <PlaceItem
                                key={place.place_id || index}
                                place={place}
                                index={index}
                                handleDeletePlace={handleDeletePlace}
                            />
                        ))}
                    </ul>
                ) : (
                    // Arrange mode
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={selectedPlacesList.map((place, index) => place.place_id || `place-${index}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul>
                                {selectedPlacesList.map((place, index) => (
                                    <SortableItem
                                        key={place.place_id || index}
                                        place={place}
                                        index={index}
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>
                )}
                <button
                    onClick={handleSubmit}
                    className="mt-4 p-2 bg-green-500 text-white rounded w-full"
                >
                    Submit
                </button>'{minCost !== null ? (
                <div>
                    <p>Minimum Cost: {minCost}</p>
                    <p>Route: {route.join(" → ")}</p>
                </div>
            ) : (
                <p>Click the button to solve TSP.</p>
            )}'
            </div>
        </div>
    );
}

export default Map;