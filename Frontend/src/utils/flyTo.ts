import { MapRef } from "@vis.gl/react-maplibre";

export const flyToLocation = (
  mapRef: MapRef | undefined,
  longitude: number,
  latitude: number
) => {
  const map = mapRef?.getMap(); // Get underlying MapLibre instance
  if (map) {
    map.flyTo({
      center: [longitude, latitude],
      duration: 1000,
      easing: (t: number) => t * (2 - t),
      essential: true,
    });
  }
};
