// hooks/useMapListeners.ts
import { useEffect, useRef } from "react";
import { fetchPlacesByBounds } from "../services/placesService";
import { place } from "../utils/types";

export default function useMapListeners(
  mapRef: any,
  setZoom: (zoom: number) => void,
  setVisiblePlaces: (places: place[]) => void,
  mapLoaded: boolean
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    const handleMapMove = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        const bounds = map.getBounds();
        console.log("Fetching places by bounds:", bounds);
        const zoom = map.getZoom();
        setZoom(zoom);

        const places = await fetchPlacesByBounds(bounds);
        setVisiblePlaces(places);
      }, 300); // Debounce by 300ms
    };

    const handleZoomChange = () => {
      setZoom(map.getZoom());
    };

    map.on("move", handleZoomChange);
    map.on("moveend", handleMapMove);

    return () => {
      map.off("moveend", handleMapMove);
      map.off("move", handleZoomChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mapLoaded, mapRef, setZoom, setVisiblePlaces]);
}
