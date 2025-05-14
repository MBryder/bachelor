import { useEffect } from "react";
import { useMap, Source, Layer } from "@vis.gl/react-maplibre";
import { Point } from "geojson";

interface AnimatedUserLocationProps {
  userLocation: { lat: number; lng: number } | null;
}

const AnimatedUserLocation = ({ userLocation }: AnimatedUserLocationProps) => {
  const mapRef = useMap();
  const map = mapRef?.current?.getMap?.();

  useEffect(() => {
    if (!map || !userLocation) return;

    const size = 100;

    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8ClampedArray(size * size * 4),
      context: null as CanvasRenderingContext2D | null,

      onAdd() {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        this.context = canvas.getContext("2d", { willReadFrequently: true });
      },

      render() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context!;
        context.clearRect(0, 0, size, size);

        // Outer pulse
        context.beginPath();
        context.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(100, 149, 255, ${1 - t})`; // Light blue
        context.fill();

        // Inner circle
        context.beginPath();
        context.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(0, 102, 255, 1)";
        context.strokeStyle = "transparent";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(0, 0, size, size).data;

        map.triggerRepaint();
        return true;
      },
    };

    if (!map.hasImage("pulsing-dot")) {
      map.addImage("pulsing-dot", pulsingDot as any, { pixelRatio: 2 });
    }

    return () => {
        try {
          map.removeImage("pulsing-dot");
        } catch (error) {
          console.error("Error removing pulsing-dot image:", error);
        }
    };
  }, [map, userLocation]);

  if (!userLocation) return null;

  const geojson: GeoJSON.FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [userLocation.lng, userLocation.lat],
        },
        properties: {},
      },
    ],
  };

  return (
    <>
      <Source id="user-location-source" type="geojson" data={geojson} />
      <Layer
        id="user-location-layer"
        type="symbol"
        source="user-location-source"
        layout={{
          "icon-image": "pulsing-dot",
          "icon-allow-overlap": true,
        }}
      />
    </>
  );
};

export default AnimatedUserLocation;
