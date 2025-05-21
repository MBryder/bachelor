// src/contexts/UserLocationContext.tsx
import React, { createContext, useContext } from "react";
import { useUserLocation } from "../hooks/useUserLocation";

type UserLocation = { lat: number; lng: number } | null;

const UserLocationContext = createContext<UserLocation>(null);

export const UserLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userLocation = useUserLocation();

  return (
    <UserLocationContext.Provider value={userLocation}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocationContext = () => {
  return useContext(UserLocationContext);
};
