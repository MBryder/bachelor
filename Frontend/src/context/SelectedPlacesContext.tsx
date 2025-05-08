import React, { createContext, useContext, useState } from "react";
import { place } from "../utils/types";

// Define the shape of the context
interface SelectedPlacesContextType {
  selectedPlacesList: place[];
  setSelectedPlacesList: React.Dispatch<React.SetStateAction<place[]>>;
}

// Create the context
const SelectedPlacesContext = createContext<SelectedPlacesContextType | undefined>(undefined);

// Provider component
export const SelectedPlacesProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlacesList, setSelectedPlacesList] = useState<place[]>([]);

  return (
    <SelectedPlacesContext.Provider value={{ selectedPlacesList, setSelectedPlacesList }}>
      {children}
    </SelectedPlacesContext.Provider>
  );
};

// Hook to use the context
export const useSelectedPlaces = (): SelectedPlacesContextType => {
  const context = useContext(SelectedPlacesContext);
  if (!context) {
    throw new Error("useSelectedPlaces must be used within a SelectedPlacesProvider");
  }
  return context;
};
