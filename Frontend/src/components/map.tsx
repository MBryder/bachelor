// yallha
import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
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

const mapOptions = {
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
};

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY;
const libraries: ("places")[] = ["places"];

// Regular item component for delete mode
function PlaceItem({ place, index, handleDeletePlace }: {
    place: google.maps.places.PlaceResult,
    index: number,
    handleDeletePlace: (index: number) => void
}) {
    return (
        <li
            className="mb-2 p-2 bg-white rounded-md shadow flex justify-between items-center"
            onClick={() => handleDeletePlace(index)}
        >
            <div>
                <h3 className="font-bold">{place.name}</h3>
                <p>{place.vicinity}</p>
            </div>
            <div className="bg-red-500 text-white rounded p-2">Click to Delete</div>
        </li>
    );
}

// Sortable item component for arrange mode
function SortableItem({ place, index }: {
    place: google.maps.places.PlaceResult,
    index: number
}) {
    const id = place.place_id || `place-${index}`;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="mb-2 p-2 bg-white rounded-md shadow flex justify-between items-center cursor-grab"
        >
            <div>
                <h3 className="font-bold">{place.name}</h3>
                <p>{place.vicinity}</p>
            </div>
            <div className="text-gray-500">Drag to reorder</div>
        </li>
    );
}

function Map({ setVisiblePlaces, visiblePlaces }: MapProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries,
    });

    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [selectedPlacesList, setSelectedPlacesList] = useState<google.maps.places.PlaceResult[]>([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    // Define marker icons safely using useMemo, only after Google Maps API is loaded
    const defaultMarkerIcon = useMemo(() => {
        if (!isLoaded) return null;
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#3B82F6", // Tailwind blue-500
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
            scale: 10,
        };
    }, [isLoaded]);

    const selectedMarkerIcon = useMemo(() => {
        if (!isLoaded) return null;
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#34D399", // Green for selected places
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
            scale: 10,
        };
    }, [isLoaded]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Check if a place is in the selectedPlacesList
    const isPlaceInList = useCallback((place: google.maps.places.PlaceResult) => {
        return selectedPlacesList.some(
            existingPlace => existingPlace.place_id === place.place_id
        );
    }, [selectedPlacesList]);

    const handleFetchPlaces = useCallback(() => {
        fetchPlaces(map, (places) => {
            setVisiblePlaces(places);
        });
    }, [map, setVisiblePlaces]);

    const handleAddPlace = (place: google.maps.places.PlaceResult) => {
        // Check if place is already in the list
        const isDuplicate = selectedPlacesList.some(
            existingPlace => existingPlace.place_id === place.place_id
        );

        if (isDuplicate) {
            toast.error(`${place.name} is already in your list`, {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#f87171',
                    color: '#fff',
                    fontWeight: 'bold',
                }
            });
            return;
        }

        setSelectedPlacesList((prevList) => [...prevList, place]);
        toast.success(`${place.name} added to your list`, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#34d399',
                color: '#fff',
                fontWeight: 'bold',
            }
        });
    };

    const handleDeletePlace = (index: number) => {
        const place = selectedPlacesList[index];
        setSelectedPlacesList((prevList) => prevList.filter((_, i) => i !== index));
        toast(`${place.name} removed from your list`, {
            icon: '🗑️',
            duration: 3000,
            position: 'top-right',
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSelectedPlacesList((places) => {
                const oldIndex = places.findIndex(place => place.place_id === active.id ||
                    (!place.place_id && `place-${places.indexOf(place)}` === active.id));
                const newIndex = places.findIndex(place => place.place_id === over.id ||
                    (!place.place_id && `place-${places.indexOf(place)}` === over.id));

                return arrayMove(places, oldIndex, newIndex);
            });
        }
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
            {/* Toast container */}
            <Toaster />
    
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
                                        icon={isPlaceInList(place) ? selectedMarkerIcon : defaultMarkerIcon}
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
                                    {isPlaceInList(selectedPlace) ? (
                                        <div className="mt-2 p-2 bg-green-500 text-white rounded text-center">
                                            Already in your list
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddPlace(selectedPlace)}
                                            className="mt-2 p-2 bg-blue-500 text-white rounded w-full"
                                        >
                                            Add to List
                                        </button>
                                    )}
                                </div>
                            </InfoWindow>
                        )}
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