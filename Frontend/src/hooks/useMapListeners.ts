import { useEffect, useRef } from "react";
import { fetchPlacesByBounds } from "../services/placesService";
import { place } from "../utils/types";
import { skipNextFetchRef } from "../utils/mapState";

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

    const handleZoomChange = () => {
      setZoom(map.getZoom());
    };

    const handleMapMoveEnd = () => {
      if (skipNextFetchRef.current) {
        console.log("[useMapListeners] SKIPPING FETCH (programmatic move).");
        skipNextFetchRef.current = false;
        return;
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        console.log("[useMapListeners] FETCHING PLACES (user move).");
        const bounds = map.getBounds();
        const places = await fetchPlacesByBounds(bounds);
        setVisiblePlaces(places);
      }, 100);
    };

    map.on("move", handleZoomChange);
    map.on("moveend", handleMapMoveEnd);

    return () => {
      map.off("moveend", handleMapMoveEnd);
      map.off("move", handleZoomChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mapLoaded, mapRef, setZoom, setVisiblePlaces]);
}
