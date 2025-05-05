import { useEffect, useState } from "react";
import Head from "../components/header";
import Map from "../components/map";
import { fetchPlaceById } from "../services/placesService";
import { useSelectedRoute } from "../context/SelectedRouteContext";
import { useSyncedState } from "../hooks/useSyncedState";

function Home() {
  const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);
  const { selectedRoute, setSelectedRoute } = useSelectedRoute();
  const [selectedPlacesList, setSelectedPlacesList, selectedPlacesRef] = useSyncedState<any[]>([]);

  const handleAddPlace = async (place: any) => {
    const resultPlace = await fetchPlaceById(place.placeId);
  
    if (!resultPlace) {
      console.error("Place could not be fetched.");
      return;
    }
  
    const currentList = selectedPlacesRef.current;
    const alreadyExists = currentList.some(
      (p) => p?.properties?.placeId === resultPlace?.properties?.placeId
    );
  
    if (alreadyExists) {
      alert("This place is already in your route.");
      return;
    }
  
    setSelectedPlacesList([...currentList, resultPlace]);
  };

  // Load full place details when selectedRoute changes
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
      <Head
        handleAddPlace={handleAddPlace}
      />
      <div className="flex h-[calc(100%-60px)]">
        <Map
          setVisiblePlaces={setVisiblePlaces}
          visiblePlaces={visiblePlaces}
          selectedPlacesList={selectedPlacesList}
          setSelectedPlacesList={setSelectedPlacesList}
          selectedPlacesRef={selectedPlacesRef}
        />
      </div>
    </div>
  );
}

export default Home;
