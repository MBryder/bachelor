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

function getRouteMidpoint(coords: [number, number][]): [number, number] | null {
  if (!coords || coords.length === 0) return null;
  // Find midpoint index, or use linear interpolation between the two middle coords for even-length arrays
  const mid = (coords.length - 1) / 2;
  const lower = Math.floor(mid);
  const upper = Math.ceil(mid);
  if (lower === upper) {
    return coords[lower];
  } else {
    return interpolateCoords(coords[lower], coords[upper], 0.5);
  }
}

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

  // Pick a point on the route for the tooltip (here: midpoint)
  const tooltipCoords = getRouteMidpoint(animatedCoords);

  // Set your tooltip label here. You could make this dynamic (distance, time, etc.)
  const tooltipText = "11 min";

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
              "line-offset": 2,
              "line-opacity": 0.95,
            }}
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
          />
        </Source>
      )}

      {tooltipCoords && (
        <Source
          id="route-tooltip-label"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: tooltipCoords,
                },
                properties: {
                  label: tooltipText,
                },
              },
            ],
          }}
        >
          <Layer
            id="route-tooltip-label-layer"
            type="symbol"
            layout={{
              "text-field": ["get", "label"],
              "text-size": 18,
              "text-font": ["Open Sans Bold"],
              "text-offset": [0, -1.2],
              "text-anchor": "bottom",
              "text-allow-overlap": true,
            }}
            paint={{
              "text-color": "#0717f2",
              "text-halo-color": "#fff",
              "text-halo-width": 2,
              "text-halo-blur": 0.5,
            }}
          />
        </Source>
      )}
    </>
  );
}
