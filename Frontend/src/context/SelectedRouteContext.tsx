// src/contexts/SelectedRouteContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Route } from '../utils/types';

interface SelectedRouteContextType {
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;
  transportMode: string;
  setTransportMode: (mode: string) => void;
}

const SelectedRouteContext = createContext<SelectedRouteContextType | undefined>(undefined);

export const SelectedRouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [transportMode, setTransportMode] = useState<string>("walking 🚶");

  return (
    <SelectedRouteContext.Provider value={{ selectedRoute, setSelectedRoute, transportMode, setTransportMode }}>
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
