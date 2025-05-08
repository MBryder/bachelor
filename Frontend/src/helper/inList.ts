// helper/useInList.ts
import { useSelectedPlaces } from "../context/SelectedPlacesContext";

export const useInList = () => {
  const { selectedPlacesList } = useSelectedPlaces();

  return (placeId: string): boolean => {
    const alreadyExists = selectedPlacesList.some((p) => p?.placeId === placeId);
    return alreadyExists;
  };
};
