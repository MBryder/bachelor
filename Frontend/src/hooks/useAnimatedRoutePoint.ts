import { useEffect } from "react";
import { lineString, length, along } from "@turf/turf";

export const useAnimatedRoutePoint = (
  routeCoordinates: google.maps.LatLngLiteral[],
  setAnimatedPoint: (point: [number, number] | null) => void
) => {
  useEffect(() => {
    if (routeCoordinates.length < 2) return;

    const line = lineString(routeCoordinates.map(coord => [coord.lng, coord.lat]));
    const totalDistance = length(line);
    const steps = totalDistance * 800;
    let counter = 0;

    const interval = setInterval(() => {
      const segment = along(line, (counter / steps) * totalDistance);
      setAnimatedPoint(segment.geometry.coordinates as [number, number]);

      counter++;
      if (counter > steps) {
        counter = 0;
      }
    }, 1);

    return () => clearInterval(interval);
  }, [routeCoordinates]);
};
