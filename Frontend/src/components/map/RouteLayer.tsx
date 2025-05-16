import { Source, Layer } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";
import { useSelectedPlaces } from "../../context/SelectedPlacesContext";
import { useSelectedRoute } from "../../context/SelectedRouteContext";
import { handleSubmit } from "../../services/mapService";

// Linear interpolation between two points
const interpolateCoords = (start: [number, number], end: [number, number], t: number): [number, number] => {
  const lng = start[0] + (end[0] - start[0]) * t;
  const lat = start[1] + (end[1] - start[1]) * t;
  return [lng, lat];
};

export default function RouteLayer() {
  const { selectedPlacesList } = useSelectedPlaces();
  const { transportMode } = useSelectedRoute();

  const [animatedCoords, setAnimatedCoords] = useState<[number, number][]>([]);
  const animationRef = useRef<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const callSubmit = async (transportMode: string) => {
    await handleSubmit(
      selectedPlacesList,
      setRouteCoordinates,
      transportMode
    );
  };

  useEffect(() => {
    callSubmit(transportMode);
  }, [selectedPlacesList, transportMode]);

  useEffect(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) {
      return;

    }

    const coords: [number, number][] = routeCoordinates.map((c: any) => [c.lng, c.lat]);
    const totalDuration = 5000;
    const totalSteps = coords.length - 1;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const exactIndex = progress * totalSteps;
      const currentIndex = Math.floor(exactIndex);
      const t = exactIndex - currentIndex;

      const newCoords = coords.slice(0, currentIndex + 1);

      // Only interpolate if we are not at the very end
      if (currentIndex < totalSteps) {
        const start = coords[currentIndex];
        const end = coords[currentIndex + 1];

        if (start && end) {
          const interp = interpolateCoords(start, end, t);
          newCoords.push(interp);
        }
      }

      setAnimatedCoords(newCoords);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
}, [routeCoordinates]);


  return (
    <>
      {animatedCoords.length > 1 && (
        <Source
          id="snapped-route"
          type="geojson"
          data={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: animatedCoords,
            },
            properties: {},
          }}
        >
          <Layer
            id="snapped-route-line"
            type="line"
            paint={{
              "line-width": 6,
              "line-color": "#0717f2",
              "line-offset": 2, // pixels
              "line-opacity": 0.95,
            }}
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
          />
        </Source>
      )}
    </>
  );
}
