import { Source, Layer, Marker } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";
import { useSelectedPlaces } from "../../context/SelectedPlacesContext";
import { useSelectedRoute } from "../../context/SelectedRouteContext";
import { handleSubmit,ORSRouteResult } from "../../services/mapService";

// Helper: interpolate between two coordinates
const interpolateCoords = (
  start: [number, number],
  end: [number, number],
  t: number
): [number, number] => {
  const lng = start[0] + (end[0] - start[0]) * t;
  const lat = start[1] + (end[1] - start[1]) * t;
  return [lng, lat];
};

// Tooltip for total route
function TotalRouteTooltip({ routeCoordinates }: { routeCoordinates: ORSRouteResult | null }) {
  if (!routeCoordinates?.segments?.length) return null;

  const totalDurationSec = routeCoordinates.segments.reduce(
    (total: number, seg: { duration: number }) => total + seg.duration,
    0
  );
  const totalDistanceM = routeCoordinates.segments.reduce(
    (total: number, seg: { distance: number }) => total + seg.distance,
    0
  );

  const totalMinutes = Math.round(totalDurationSec / 60);
  const durationString =
    totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 > 0 ? ` ${totalMinutes % 60}min` : ""}`
      : `${totalMinutes} min`;
  const distanceString = `${(totalDistanceM / 1000).toFixed(1)} km`;

  return (
    <div className="bg-white border border-gray-400 rounded shadow px-2 py-1 flex items-center gap-2 text-[15px]">
      <span className="font-semibold">{durationString}</span>
      <span className="text-gray-500" style={{ fontSize: "13px" }}>
        {distanceString}
      </span>
    </div>
  );
}

export default function RouteLayer() {
  const { selectedPlacesList } = useSelectedPlaces();
  const {
    transportMode,
    setPlacesOrder,
    setRouteCoordinates,
    routeCoordinates,
  } = useSelectedRoute();

  const [animatedCoords, setAnimatedCoords] = useState<[number, number][]>([]);
  const animationRef = useRef<number | null>(null);
  const [tooltipCoord, setTooltipCoord] = useState<[number, number] | null>(null);

  // Submit to backend for route whenever places/mode changes
  const callSubmit = async (transportMode: string) => {
    await handleSubmit(
      selectedPlacesList,
      setRouteCoordinates,
      transportMode,
      setPlacesOrder
    );
  };

  useEffect(() => {
    callSubmit(transportMode);
    // eslint-disable-next-line
  }, [selectedPlacesList, transportMode]);

  // Animate the route line and set tooltip position
  useEffect(() => {
    if (!routeCoordinates || routeCoordinates.coordinates.length < 2) {
      setAnimatedCoords([]);
      setTooltipCoord(null);
      return;
    }

    const coords: [number, number][] = routeCoordinates.coordinates.map(
      (c: any) => [c.lng, c.lat]
    );
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

      // Only interpolate if not at the very end
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

    // Tooltip at midpoint
    if (coords.length > 1) {
      const mid = Math.floor(coords.length / 2);
      setTooltipCoord([coords[mid][0], coords[mid][1]]);
    } else {
      setTooltipCoord(null);
    }

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

      {tooltipCoord && (
        <Marker
          longitude={tooltipCoord[0]}
          latitude={tooltipCoord[1]}
          anchor="bottom"
        >
          <TotalRouteTooltip routeCoordinates={routeCoordinates} />
        </Marker>
      )}
    </>
  );
}
