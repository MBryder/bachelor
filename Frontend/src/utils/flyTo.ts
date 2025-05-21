import { useMapRef } from "../context/MapRefContext";
import { skipNextFetchRef } from "./mapState";
import { Point } from "geojson";

// Fly to location (programmatic move)
export function useFlyToLocation() {
  const mapRef = useMapRef();
  return (longitude: number, latitude: number) => {
    const map = mapRef.current?.getMap();
    if (map) {
      console.log("[flyToLocation] SET SKIP");
      skipNextFetchRef.current = true;
      map.flyTo({
        center: [longitude, latitude],
        duration: 1000,
        easing: (t: number) => t * t,
        essential: true,
      });
    }
  };
}

// Expand a cluster and animate (multiple programmatic moves)
export function useExpandClusterAndFly() {
  const mapRef = useMapRef();
  return async (clusterId: number, clusterFeature: any) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // @ts-ignore
    const source = map.getSource("cluster-source") as maplibregl.GeoJSONSource;
    if (!source || typeof source.getClusterExpansionZoom !== "function") return;

    try {
      const expansionZoom = await source.getClusterExpansionZoom(clusterId);
      const [longitude, latitude] = (clusterFeature.geometry as Point).coordinates as [number, number];

      const currentZoom = map.getZoom();
      const zoomSteps = 2;
      const stepZoomChange = (expansionZoom - currentZoom);

      let step = 1;
      const zoomNextStep = () => {
        if (step > zoomSteps) return;
        console.log(`[expandClusterAndFly] SET SKIP (step ${step})`);
        skipNextFetchRef.current = true;
        map.easeTo({
          center: [longitude, latitude],
          zoom: currentZoom + stepZoomChange * step,
          duration: 250,
          easing: (t) => t * (2 - t),
        });
        step++;
        map.once("moveend", zoomNextStep);
      };
      console.log("[expandClusterAndFly] Initial SET SKIP");
      skipNextFetchRef.current = true;
      zoomNextStep();
    } catch (err) {
      console.error("Error expanding cluster:", err);
    }
  };
}
