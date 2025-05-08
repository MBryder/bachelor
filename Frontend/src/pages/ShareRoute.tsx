import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Head from "../components/header";
import MapWrapper from "../components/map/MapWrapper";
import { fetchPlaceById } from "../services/placesService";
import { fetchRouteById } from "../services/routeService";
import { useSelectedPlaces } from "../context/SelectedPlacesContext";

function ShareRoute() {
  const { routeId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const {setSelectedPlacesList,} = useSelectedPlaces();

  useEffect(() => {
    const loadRoute = async () => {
      if (!routeId) return;

      try {
        const route = await fetchRouteById(routeId); // returns { waypoints: string[] }
        const placeDetails = await Promise.all(
          route.waypoints.map((id: string) => fetchPlaceById(id))
        );
        setSelectedPlacesList(placeDetails);
      } catch (err) {
        console.error("Error loading shared route:", err);
        setError("Failed to load route. Please check the link.");
      }
    };

    loadRoute();
  }, [routeId]);

  return (
    <div className="bg-background-beige1 h-screen text-text-dark flex-row">
      <Head />
      <div className="flex h-[calc(100%-60px)]">
        {error ? (
          <div className="m-auto text-center text-red-600">{error}</div>
        ) : (
          <MapWrapper />
        )}
      </div>
    </div>
  );
}

export default ShareRoute;
