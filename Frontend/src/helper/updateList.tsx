import { useSelectedPlaces } from "../context/SelectedPlacesContext";
import { place } from "../utils/types";

export const useAddToList = () => {
  const { selectedPlacesList, setSelectedPlacesList } = useSelectedPlaces();

  const addToList = (Place: place) => {
    if (selectedPlacesList.length >= 20) {
      alert("You can only add up to 20 places in your route.");
      return;
    }

    if (selectedPlacesList.some(p => p.id === Place.id)) {
      alert("This place is already in your list.");
      return;
    }

    setSelectedPlacesList(prev => [...prev, Place]);
  };

  return addToList;
};


export const useRemoveFromList = () => {
  const { selectedPlacesList, setSelectedPlacesList } = useSelectedPlaces();

  const removeFromList = (placeId: string) => {
    console.log("removeFromList", placeId);
    const updatedList = selectedPlacesList.filter(place => place.placeId !== placeId);
    setSelectedPlacesList(updatedList);
  };

  return removeFromList;
};
