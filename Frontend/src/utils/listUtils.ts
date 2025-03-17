import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import toast from "react-hot-toast";

/**
 * Handles deleting a place from the list and shows a toast notification.
 */
export function handleDeletePlace(
    index: number,
    selectedPlacesList: google.maps.places.PlaceResult[],
    setSelectedPlacesList: (places: google.maps.places.PlaceResult[] | ((prevList: google.maps.places.PlaceResult[]) => google.maps.places.PlaceResult[])) => void
) {
    const place = selectedPlacesList[index];
    setSelectedPlacesList((prevList) => prevList.filter((_, i) => i !== index));

    toast(`${place.name} removed from your list`, {
        icon: "🗑️",
        duration: 3000,
        position: "top-right",
    });
}

/**
 * Handles drag-and-drop reordering of places in the list.
 */
export function handleDragEnd(
    event: DragEndEvent,
    setSelectedPlacesList: (places: google.maps.places.PlaceResult[] | ((prevList: google.maps.places.PlaceResult[]) => google.maps.places.PlaceResult[])) => void
) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSelectedPlacesList((places) => {
        const oldIndex = places.findIndex((place) =>
            place.place_id === active.id || (!place.place_id && `place-${places.indexOf(place)}` === active.id)
        );
        const newIndex = places.findIndex((place) =>
            place.place_id === over.id || (!place.place_id && `place-${places.indexOf(place)}` === over.id)
        );

        return arrayMove(places, oldIndex, newIndex);
    });
}
