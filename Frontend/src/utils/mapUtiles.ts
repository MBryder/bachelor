import toast from "react-hot-toast";

/**
 * Checks if a place is already in the selected list.
 */
export function isPlaceInList(place: google.maps.places.PlaceResult, selectedPlacesList: google.maps.places.PlaceResult[]): boolean {
    return selectedPlacesList.some(existingPlace => existingPlace.place_id === place.place_id);
}

/**
 * Adds a place to the selected list and shows a toast notification.
 */
export function handleAddPlace(
    place: google.maps.places.PlaceResult,
    selectedPlacesList: google.maps.places.PlaceResult[],
    setSelectedPlacesList: (places: google.maps.places.PlaceResult[] | ((prevList: google.maps.places.PlaceResult[]) => google.maps.places.PlaceResult[])) => void
) {
    if (isPlaceInList(place, selectedPlacesList)) {
        toast.error(`${place.name} is already in your list`, {
            duration: 3000,
            position: "top-right",
            style: {
                background: "#f87171",
                color: "#fff",
                fontWeight: "bold",
            },
        });
        return;
    }

    setSelectedPlacesList((prevList) => [...prevList, place]);

    toast.success(`${place.name} added to your list`, {
        duration: 3000,
        position: "top-right",
        style: {
            background: "#34d399",
            color: "#fff",
            fontWeight: "bold",
        },
    });
}

/**
 * Fetches places from Google Maps and updates the visiblePlaces state.
 */
export function handleFetchPlaces(
    map: google.maps.Map | null,
    setVisiblePlaces: (places: google.maps.places.PlaceResult[]) => void,
    fetchPlaces: (map: google.maps.Map | null, callback: (places: google.maps.places.PlaceResult[]) => void) => void
) {
    if (!map) return;
    fetchPlaces(map, setVisiblePlaces);
}

/**
 * Generates a default Google Maps marker icon.
 */
export function getDefaultMarkerIcon(isLoaded: boolean): google.maps.Symbol | undefined {
    if (!isLoaded) return undefined;
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#3B82F6", // Tailwind blue-500
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 10,
    };
}

/**
 * Generates a selected Google Maps marker icon.
 */
export function getSelectedMarkerIcon(isLoaded: boolean): google.maps.Symbol | undefined {
    if (!isLoaded) return undefined;
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#34D399", // Green for selected places
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 10,
    };
}
