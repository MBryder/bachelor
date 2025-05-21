// hooks/useShareLoader.ts
import { useEffect } from "react";

export default function useShareLoader(
  mapRef: any,
  setZoom: (zoom: number) => void,
  mapLoaded: boolean
) {
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    const handleZoomChange = () => {
      setZoom(map.getZoom());
    };

    map.on("move", handleZoomChange);

    return () => {
      map.off("move", handleZoomChange);
    };
  }, [mapLoaded, mapRef, setZoom]);
}
