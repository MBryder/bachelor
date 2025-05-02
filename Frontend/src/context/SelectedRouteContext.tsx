// src/contexts/SelectedRouteContext.tsx
import React, { createContext, useState, useContext } from 'react';

export interface Route {
  id: string;
  customName: string;
  createdAt: string;
  waypoints: string[];
}

interface SelectedRouteContextType {
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;
}

const SelectedRouteContext = createContext<SelectedRouteContextType | undefined>(undefined);

export const SelectedRouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  return (
    <SelectedRouteContext.Provider value={{ selectedRoute, setSelectedRoute }}>
      {children}
    </SelectedRouteContext.Provider>
  );
};

export const useSelectedRoute = () => {
  const context = useContext(SelectedRouteContext);
  if (!context) {
    throw new Error('useSelectedRoute must be used within a SelectedRouteProvider');
  }
  return context;
};
