import { Source, Layer } from "@vis.gl/react-maplibre";
import type { FeatureCollection } from "geojson";

export default function ClusterLayer({ zoom, filteredVisiblePlaces }: any) {
  if (zoom >= 14) return null;

  const clusterGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: filteredVisiblePlaces.map((place: any) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
      properties: { placeId: place.placeId },
    })),
  };

  return (
    <Source id="cluster-source" type="geojson" data={clusterGeoJson} cluster={true} clusterMaxZoom={14} clusterRadius={90}>
      <Layer id="clusters" type="circle" filter={["has", "point_count"]} paint={{
        "circle-color": ["step", ["get", "point_count"], "#51bbd6", 10, "#f1f075", 30, "#f28cb1"],
        "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
      }} />
      <Layer id="cluster-count" type="symbol" filter={["has", "point_count"]} layout={{
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Open Sans Bold"],
        "text-size": 12,
      }} paint={{ "text-color": "#000" }} />
    </Source>
  );
}