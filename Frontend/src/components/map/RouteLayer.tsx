import { Source, Layer } from "@vis.gl/react-maplibre";
import { useEffect } from "react";
import { useSelectedPlaces } from "../../context/SelectedPlacesContext";
import { useSelectedRoute } from "../../context/SelectedRouteContext";

export default function RouteLayer({ animatedPoint, routeCoordinates, callSubmit }: any) {

  const { selectedPlacesList } = useSelectedPlaces();
  const {transportMode } = useSelectedRoute();

  useEffect(() => {
    callSubmit(transportMode);
  }, [selectedPlacesList, transportMode]);


  return (
    <>
      {routeCoordinates.length > 1 && (
        <Source
          id="snapped-route"
          type="geojson"
          data={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates.map((coord: any) => [coord.lng, coord.lat]),
            },
            properties: {},
          }}
        >
          <Layer id="snapped-route-line" type="line" paint={{
            "line-width": 4,
            "line-color": "purple",
            "line-dasharray": [1, 3],
            "line-opacity": 0.9,
          }} layout={{ "line-cap": "round", "line-join": "round" }} />
        </Source>
      )}

      {animatedPoint && (
        <Source
          id="route-point"
          type="geojson"
          data={{
            type: "Feature",
            geometry: { type: "Point", coordinates: animatedPoint },
            properties: {},
          }}
        >
          <Layer id="route-point-layer" type="circle" paint={{ "circle-radius": 8, "circle-color": "green" }} />
        </Source>
      )}
    </>
  );
}