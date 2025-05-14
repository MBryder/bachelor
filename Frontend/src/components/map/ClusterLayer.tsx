import { Source, Layer, useMap } from "@vis.gl/react-maplibre";
import { useEffect, useMemo } from "react";
import type { FeatureCollection, Feature, Point } from "geojson";
import { expandClusterAndFly } from "../../utils/flyTo";
import maplibregl from "maplibre-gl";

interface Place {
  placeId: string;
  latitude: number;
  longitude: number;
}

interface Props {
  zoom: number;
  filteredVisiblePlaces: Place[];
}

export default function ClusterLayer({ zoom, filteredVisiblePlaces }: Props) {
  const { current: map } = useMap();

  // React hooks must always be called, even if you return early later
  const clusterGeoJson: FeatureCollection = useMemo(() => ({
    type: "FeatureCollection",
    features: filteredVisiblePlaces.map((place): Feature<Point> => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
      properties: { placeId: place.placeId },
    })),
  }), [filteredVisiblePlaces]);

  useEffect(() => {
    if (!map) return;

    const handleClick = async (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });

      const cluster = features[0];
      if (!cluster) return;

      const clusterId = cluster.properties?.cluster_id;
      if (typeof clusterId !== "number") return;

      // 👇 Use your helper function
      await expandClusterAndFly(map, clusterId, cluster);
    };

    map.on("click", "clusters", handleClick);
    return () => {
      map.off("click", "clusters", handleClick);
    };
  }, [map]);

  // Only render the Source and Layer if zoom < 14
  if (zoom >= 14) return null;

  return (
    <Source
      id="cluster-source"
      type="geojson"
      data={clusterGeoJson}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={90}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": ["step", ["get", "point_count"], "#51bbd6", 10, "#f1f075", 30, "#f28cb1"],
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
        }}
      />
      <Layer
        id="cluster-count"
        type="symbol"
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold"],
          "text-size": 12,
        }}
        paint={{ "text-color": "#000" }}
      />
    </Source>
  );
}
