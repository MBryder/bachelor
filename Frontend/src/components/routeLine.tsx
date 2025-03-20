import { Source, Layer } from "@vis.gl/react-maplibre";
import { FeatureCollection, LineString } from "geojson"; // Import GeoJSON types

interface RouteLineProps {
    places: { lng: number; lat: number }[]; // array of places
}

const RouteLine = ({ places }: RouteLineProps) => {
    if (places.length < 2) return null; // No line if fewer than 2 places

    // make GeoJSOn
    const lineGeoJSON: FeatureCollection<LineString> = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: places.map((place) => [place.lng, place.lat]),
                },
                properties: {},
            },
        ],
    };

    return (
        <Source id="route" type="geojson" data={lineGeoJSON}>
            <Layer
                id="route-layer"
                type="line"
                paint={{
                    "line-color": "#1E90FF", // Blue line
                    "line-width": 4,
                    "line-opacity": 0.8,
                }}
            />
        </Source>
    );
};

export default RouteLine;
