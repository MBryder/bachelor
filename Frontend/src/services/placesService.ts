import { toast } from "react-hot-toast";

export const fetchPlacesByBounds = async (
  bounds: any,
  setGeoJsonData: (data: any) => void,
  setVisiblePlaces: (places: any[]) => void,
  setRouteGeoJson: (route: any) => void
) => {
  const { _sw, _ne } = bounds;
  const backendUrl = `http://localhost:5001/places/by-bounds?swLat=${_sw.lat}&swLng=${_sw.lng}&neLat=${_ne.lat}&neLng=${_ne.lng}`;

  try {
    const response = await fetch(backendUrl);
    const places = await response.json();

    const geoJson = {
      type: "FeatureCollection",
      features: places.map((place: any) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [place.longitude, place.latitude],
        },
        properties: {
          id: place.id,
          name: place.name,
          rating: place.rating,
          ...place,
        },
      })),
    };

    setGeoJsonData(geoJson);
    setVisiblePlaces(geoJson.features);

    const routeGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: geoJson.features.map((place: any) => place.geometry.coordinates),
          },
          properties: {},
        },
      ],
    };

    setRouteGeoJson(routeGeoJSON);
    toast.success(`Found ${geoJson.features.length} places!`);
  } catch (error) {
    console.error("Error querying places:", error);
    toast.error("Failed to fetch places from backend.");
  }
};