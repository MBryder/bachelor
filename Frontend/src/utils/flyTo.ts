import { MapRef } from "@vis.gl/react-maplibre";
import { Point } from "geojson";

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


export const expandClusterAndFly = async (
  mapRef: MapRef | undefined,
  clusterId: number,
  clusterFeature: any
) => {
  const map = mapRef?.getMap();
  if (!map) return;

  const source = map.getSource("cluster-source") as maplibregl.GeoJSONSource;
  if (!source || typeof source.getClusterExpansionZoom !== "function") return;

  try {
    const expansionZoom = await source.getClusterExpansionZoom(clusterId);
    const [longitude, latitude] = (clusterFeature.geometry as Point).coordinates as [number, number];

    const currentZoom = map.getZoom();
    const zoomSteps = 3;
    const stepZoomChange = (expansionZoom - currentZoom) / zoomSteps;

    let step = 1;

    const zoomNextStep = () => {
      if (step > zoomSteps) return;

      map.easeTo({
        center: [longitude, latitude],
        zoom: currentZoom + stepZoomChange * step,
        duration: 250,
        easing: (t) => t * (2 - t),
      });

      step++;
      map.once("moveend", zoomNextStep); // chain next step on animation end
    };

    zoomNextStep(); // start the zooming chain

  } catch (err) {
    console.error("Error expanding cluster:", err);
  }
};