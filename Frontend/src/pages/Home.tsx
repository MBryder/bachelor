import { useEffect, useState } from "react";
import Head from "../components/header";
import MapWrapper from "../components/map/MapWrapper";
import { fetchPlaceById } from "../services/placesService";
import { useSelectedRoute } from "../context/SelectedRouteContext";
import { useSelectedPlaces } from "../context/SelectedPlacesContext";

function Home() {
  const { selectedRoute, setSelectedRoute } = useSelectedRoute();
  const { setSelectedPlacesList } = useSelectedPlaces();

  useEffect(() => {
    const loadRoutePlaces = async () => {
      if (!selectedRoute) return;

      try {
        const places = await Promise.all(
          selectedRoute.waypoints.map((placeId: string) =>
            fetchPlaceById(placeId)
          )
        );
        setSelectedPlacesList(places);
        setSelectedRoute(null); // Optional: clear route after loading
      } catch (err) {
        console.error("Failed to load route waypoints:", err);
      }
    };

    loadRoutePlaces();
  }, [selectedRoute, setSelectedRoute]);

  return (
    <div className="bg-background-beige1 h-screen text-text-dark flex-row">
      <Head />
      <div className="flex h-[calc(100%-60px)]">
        <MapWrapper />
      </div>
    </div>
  );
}

export default Home;
