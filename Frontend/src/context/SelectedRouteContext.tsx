// src/contexts/SelectedRouteContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Route } from '../utils/types';
import { ORSRouteResult  } from "../services/mapService";

interface SelectedRouteContextType {
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;
  transportMode: string;
  setTransportMode: (mode: string) => void;
  placesOrder: number[];
  setPlacesOrder: (order: number[]) => void;
  routeCoordinates: ORSRouteResult | null;
  setRouteCoordinates: (coordinates: ORSRouteResult | null) => void;
}

const SelectedRouteContext = createContext<SelectedRouteContextType | undefined>(undefined);

export const SelectedRouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [transportMode, setTransportMode] = useState<string>("walking");
  const [placesOrder, setPlacesOrder] = useState<number[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<ORSRouteResult | null>(null);

  return (
    <SelectedRouteContext.Provider value={{ selectedRoute, setSelectedRoute, transportMode, setTransportMode, placesOrder, setPlacesOrder, routeCoordinates, setRouteCoordinates }}>
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
