import { useEffect} from "react";
import Head from "../components/header";
import MapWrapper from "../components/map/MapWrapper";
import { fetchPlaceById } from "../services/placesService";
import { useSelectedRoute } from "../context/SelectedRouteContext";
import { useSelectedPlaces } from "../context/SelectedPlacesContext";

function Home() {
  const { selectedRoute, setSelectedRoute, transportMode, setTransportMode } = useSelectedRoute();
  const { setSelectedPlacesList } = useSelectedPlaces();

  useEffect(() => {
    const loadRoutePlaces = async () => {
      if (!selectedRoute) return;

      console.log("Selected route:", selectedRoute);

      try {
        const places = await Promise.all(
          selectedRoute.waypoints.map((placeId: string) =>
            fetchPlaceById(placeId)
          )
        );
        console.log(selectedRoute.transportationMode)
        setTransportMode(selectedRoute.transportationMode);
        setSelectedPlacesList(places);
        setSelectedRoute(null);
      } catch (err) {
        console.error("Failed to load route waypoints:", err);
      }
    };

    loadRoutePlaces();
  }, [selectedRoute, setSelectedRoute]);

  useEffect(() => {
    console.log("Transport mode changed:", transportMode);
  } , [transportMode]);

  return (
    <div className="bg-background-beige1 h-screen text-text-dark flex-row">
      <Head />
      <div className="flex h-[calc(100%-60px)]">
        <MapWrapper 
          showOverlay = {true}
        />
      </div>
    </div>
  );
}

export default Home;
