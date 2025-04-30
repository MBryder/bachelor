import { toast } from "react-hot-toast";
import axios from "axios";

// Minimal GeoJSON types (no installation needed)
type PointGeometry = {
  type: "Point";
  coordinates: [number, number];
};

type GeoJsonFeature = {
  type: "Feature";
  geometry: PointGeometry;
  properties: { [key: string]: any };
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

// Stronger typing for Place
export type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating?: number;
  [key: string]: any;
};

export const fetchPlaceById = async (id: string) => {
    const url = `http://localhost:5001/places/id?id=${encodeURIComponent(id)}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        },
      });
  
      const places: Place[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.places)
      ? response.data.places
      : [];

        const geoJson: GeoJsonFeatureCollection = {
            type: "FeatureCollection",
            features: places.map((place): GeoJsonFeature => ({
                type: "Feature",
                geometry: {
                type: "Point",
                coordinates: [place.longitude, place.latitude],
                },
                properties: {
                ...place,
                },
            })),
        };
        return geoJson.features[0]
    } catch (error) {
      console.error("Error fetching place by id:", error);
      return null;
    }
  };

export const fetchPlacesByBounds = async (
  bounds: any,
  setVisiblePlaces: (places: GeoJsonFeature[]) => void,
) => {
  const { _sw, _ne } = bounds;

  const url = `http://localhost:5001/places/by-bounds?swLat=${_sw.lat}&swLng=${_sw.lng}&neLat=${_ne.lat}&neLng=${_ne.lng}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      }
    });

    const places: Place[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.places)
      ? response.data.places
      : [];

    const geoJson: GeoJsonFeatureCollection = {
      type: "FeatureCollection",
      features: places.map((place): GeoJsonFeature => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [place.longitude, place.latitude],
        },
        properties: {
          ...place,
        },
      })),
    };

    setVisiblePlaces(geoJson.features);

    toast.success(`Found ${geoJson.features.length} places!`);
  } catch (error) {
    console.error("Error fetching places by bounds:", error);
    toast.error("Failed to fetch places from backend.");
  }
};

export const fetchSearchResults = async (query: string): Promise<Place[]> => {
  const url = 'http://localhost:5001/places/name?Name=' + encodeURIComponent(query);

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
      }
    });

    console.log("API Response:", response.data);

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    } else if (Array.isArray(data.places)) {
      return data.places;
    } else {
      console.error("Unexpected API structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};
