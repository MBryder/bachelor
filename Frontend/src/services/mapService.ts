import axios from "axios";
import { API_BASE } from "./api";

const API_BASE_URL = `${API_BASE}/api/Rust`;
const API_OPEN_ROUTE_SERVICE_KEY =
  "5b3ce3597851110001cf6248f9076d1fd33646bc9639a339df6bfc14";

const mapTransportMode = (mode: string) => {
  switch (mode) {
    case "walking":
      return "foot-walking";
    case "cycling":
      return "cycling-regular";
    case "e-cycling":
      return "cycling-electric";
    case "wheelchair":
      return "wheelchair";
    case "driving":
    default:
      return "driving-car";
  }
};

export interface LatLng {
  lat: number;
  lng: number;
}

export const getShortestPath = async (distances: number[], n: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tsp`, {
      N: n,
      Distances: distances,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shortest path:", error);
    throw error;
  }
};

export const getDistanceMatrix = async (
  coordinates: { lat: number; lng: number }[],
  transportMode: string // <-- add mode here
) => {
  try {
    const formattedCoordinates: number[][] = coordinates.map((coord) => [
      coord.lng,
      coord.lat,
    ]);

    const mode = mapTransportMode(transportMode);
    const url = `https://api.openrouteservice.org/v2/matrix/${mode}`;

    const response = await axios.post(
      url,
      {
        locations: formattedCoordinates,
        metrics: ["distance"],
        units: "m",
      },
      {
        headers: {
          Authorization: API_OPEN_ROUTE_SERVICE_KEY,
          "Content-Type": "application/json",
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        },
      }
    );

    const flatResponse = response.data.distances.flat();
    return flatResponse.map((x: number) => Math.round(x));
  } catch (error) {
    console.error("Error fetching distance matrix:", error);
    throw error;
  }
};

export interface ORSRouteResult {
  coordinates: LatLng[];
  segments: any;
}

export const getORSRoadsPath = async (
  coordinates: LatLng[],
  apiKey: string,
  transportMode: string
): Promise<ORSRouteResult> => {
  if (coordinates.length < 2) return { coordinates, segments: [] };

  const mode = mapTransportMode(transportMode);
  const url = `https://api.openrouteservice.org/v2/directions/${mode}/geojson`;

  const body = {
    coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("ORS API response:", data);

    if (
      data &&
      data.features &&
      data.features[0] &&
      data.features[0].geometry &&
      Array.isArray(data.features[0].geometry.coordinates)
    ) {
      return {
        coordinates: data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({ lat, lng })
        ),
        segments: data.features[0].properties.segments,
      };
    }
  } catch (error) {
    console.error("Error fetching route from OpenRouteService:", error);
  }

  // fallback if API fails
  return { coordinates, segments: [] };
};

export const handleSubmit = async (
  selectedPlacesList: any[],
  setRouteCoordinates: (coordinates: ORSRouteResult) => void,
  transportMode: string,
  setPlacesOrder: (order: number[]) => void
) => {
  if (selectedPlacesList.length < 2) return;

  const arrayOfGeo = selectedPlacesList.map((place) => ({
    lat: place.latitude,
    lng: place.longitude,
  }));

  try {
    const distances1 = await getDistanceMatrix(arrayOfGeo, transportMode);
    const n = selectedPlacesList.length;
    const result = await getShortestPath(distances1, n);
    setPlacesOrder(result.route);
    console.log("short ", result);

    const orderedCoordinates = result.route.map(
      (idx: number) => arrayOfGeo[idx]
    );
    console.log(orderedCoordinates);
    const snappedCoordinates = await getORSRoadsPath(
      orderedCoordinates,
      API_OPEN_ROUTE_SERVICE_KEY,
      transportMode
    );
    console.log("here", snappedCoordinates);
    setRouteCoordinates(snappedCoordinates);
  } catch (error) {
    console.error("Error fetching shortest path:", error);
  }
};

export default Map;
