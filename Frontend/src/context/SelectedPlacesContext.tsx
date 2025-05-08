import React, { createContext, useContext, useState } from "react";

// Define the shape of the context
interface SelectedPlacesContextType {
  selectedPlacesList: any[];
  setSelectedPlacesList: React.Dispatch<React.SetStateAction<any[]>>;
}

// Create the context
const SelectedPlacesContext = createContext<SelectedPlacesContextType | undefined>(undefined);

// Provider component
export const SelectedPlacesProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlacesList, setSelectedPlacesList] = useState<any[]>([]);

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
