import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/Rust";
const API_OPEN_ROUTE_SERVICE = "https://api.openrouteservice.org/v2/matrix/foot-walking";
const API_OPEN_ROUTE_SERVICE_KEY = "5b3ce3597851110001cf6248f9076d1fd33646bc9639a339df6bfc14";

export const getShortestPath = async (distances: number[], n: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/tsp`, {
            N: n,
            Distances: distances
        });

        console.log("API Response:", response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error("Error fetching shortest path:", error);
        throw error;
    }
};

export const fetchSearchResults = async (query: string) => {
  
  const url = 'http://localhost:5001/places/name?Name=' + query;

  try {
      const response = await axios.get(url, {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
          }
      });
      console.log("API Response:", response.data); // Debugging log
      return response.data;
  }
  catch (error) {
      console.error("Error fetching search results:", error);
  }
}

export const getDistanceMatrix = async (coordinates: { lat: number; lng: number; }[]) => {
    try {
        // Convert [{ lat, lng }, { lat, lng }] to [[lat, lng], [lat, lng]]
        const formattedCoordinates: number[][] = coordinates.map(coord => [coord.lng, coord.lat]); // OpenRouteService expects [lng, lat]

        const response = await axios.post(`${API_OPEN_ROUTE_SERVICE}`, {
            locations: formattedCoordinates, 
            metrics: ["distance"],
            units: "m"
        }, {
            headers: {
                "Authorization": API_OPEN_ROUTE_SERVICE_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
            }
    
    });
        console.log("API Response:", response.data.distances); // Debugging log
        console.log("API Response:", response.data.distances.flat()); // Debugging log

        const flatResponse = response.data.distances.flat();
        const intResponse = flatResponse.map((x: number) => Math.round(x)); 


        return intResponse;
    } catch (error) {
        console.error("Error fetching distance matrix:", error);
        throw error;
    }
};

const getORSRoadsPath = async (
    coordinates: google.maps.LatLngLiteral[],
    apiKey: string
  ): Promise<google.maps.LatLngLiteral[]> => {
    if (coordinates.length < 2) return coordinates;
  
    const url = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson';
  
    const body = {
      coordinates: coordinates.map(coord => [coord.lng, coord.lat]),
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (data) {
        return data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({ lat, lng })
        );
      }
    } catch (error) {
      console.error('Error fetching route from OpenRouteService:', error);
    }
  
    return coordinates;
  };

export const handleSubmit = async (
    selectedPlacesList: any[],
    setRoute: (route: number[]) => void,
    setMinCost: (minCost: number) => void,
    setRouteCoordinates: (coordinates: any[]) => void,
) => {
    console.log("Submit button clicked");
    console.log(selectedPlacesList);

    if (selectedPlacesList.length < 2) return;

    const arrayOfGeo = selectedPlacesList.map(place => ({
        lat: place.geometry?.coordinates[1],
        lng: place.geometry?.coordinates[0]
    }));

    try {
        const distances1 = await getDistanceMatrix(arrayOfGeo);
        const n = selectedPlacesList.length;
        const result = await getShortestPath(distances1, n);
        setRoute(result.route);
        setMinCost(result.minCost);

        const orderedCoordinates = result.route.map((idx: number) => arrayOfGeo[idx]);
        const snappedCoordinates = await getORSRoadsPath(orderedCoordinates,API_OPEN_ROUTE_SERVICE_KEY);
        setRouteCoordinates(snappedCoordinates);
    } catch (error) {
        console.error("Error fetching shortest path:", error);
    }
};

export default Map;
