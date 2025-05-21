import { createContext, useContext, RefObject } from "react";
import { MapRef } from "@vis.gl/react-maplibre";

export const MapRefContext = createContext<RefObject<MapRef> | null>(null);

export const useMapRef = () => {
  const ctx = useContext(MapRefContext);
  if (!ctx) throw new Error("useMapRef must be used within a MapRefProvider");
  return ctx;
};
