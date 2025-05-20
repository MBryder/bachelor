import { toast } from "react-hot-toast";
import axios from "axios";
import { place } from "../utils/types";
import { API_BASE } from "./api";

const token = localStorage.getItem("token");

export const fetchPlaceById = async (id: string) => {
    const url = `${API_BASE}/places/id?id=${encodeURIComponent(id)}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        },
      });

      return response.data[0];

    } catch (error) {
      console.error("Error fetching place by id:", error);
      return null;
    }
  };

  export const fetchPlacesByBounds = async (bounds: any): Promise<place[]> => {
    const { _sw, _ne } = bounds;
  
    const url = `${API_BASE}/places/by-bounds?swLat=${_sw.lat}&swLng=${_sw.lng}&neLat=${_ne.lat}&neLng=${_ne.lng}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const places: place[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.places)
        ? response.data.places
        : [];
  
      return places;
    } catch (error) {
      console.error("Error fetching places by bounds:", error);
      toast.error("Failed to fetch places from backend.");
      return [];
    }
  };

export const fetchSearchResults = async (query: string): Promise<place[]> => {
  const url = `${API_BASE}/places/name?Name=` + encodeURIComponent(query);

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        Authorization: `Bearer ${token}`,
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

export const createUserLocationPlace = async (placeId: string, latitude: number, longitude: number): Promise<place> => {
  const response = await axios.post("http://localhost:5001/places/create", {
    placeId,
    latitude,
    longitude,
  });
  return response.data;
};
