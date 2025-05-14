import { useRef, useState } from "react";
import { Map, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useUserLocation } from "../../hooks/useUserLocation";
import AnimatedUserLocation from "./AnimatedUserLocation";
import { useSelectedPlaces } from "../../context/SelectedPlacesContext";
import useMapListeners from "../../hooks/useMapListeners";
import UIOverlay from "./UIOverlay";
import ClusterLayer from "./ClusterLayer";
import MarkersLayer from "./MarkersLayer";
import RouteLayer from "./RouteLayer";
import { handleSubmit } from "../../services/mapService";


interface MapWrapperProps {
  showOverlay: boolean;
}

export default function MapWrapper({ showOverlay }: MapWrapperProps) {
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [minCost, setMinCost] = useState<number | null>(null);
  const [route, setRoute] = useState<number[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [zoom, setZoom] = useState(10);
  const [checked, setChecked] = useState(false);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");
  const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openPopupPlaceId, setOpenPopupPlaceId] = useState<string | null>(null);

  const userLocation = useUserLocation();
  const { selectedPlacesList, setSelectedPlacesList } = useSelectedPlaces();

  useMapListeners(mapRef, setZoom, setVisiblePlaces, mapLoaded);

  const filteredVisiblePlaces = filterTypes.length > 0
    ? visiblePlaces.filter((place: any) =>
        place.details?.types?.some((type: string) => filterTypes.includes(type))
      )
    : visiblePlaces;

  const callSubmit = async (transportMode: string) => {
    await handleSubmit(
      selectedPlacesList,
      setRoute,
      setMinCost,
      setRouteCoordinates,
      transportMode
    );
  };

  return (
    <div className="flex w-full h-full relative">
      {loading && <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded shadow">Loading...</div>}
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 12.5939, latitude: 55.6632, zoom: 10 }}
        mapStyle="https://api.maptiler.com/maps/bright/style.json?key=L0M8KVYaAAuKx695rSCS"
        onLoad={() => setMapLoaded(true)}
      >
        {showOverlay && (
          <UIOverlay
          visiblePlaces={filteredVisiblePlaces}
          setSelectedPlacesList={setSelectedPlacesList}
          showMoreDetails={showMoreDetails}
          setShowMoreDetails={setShowMoreDetails}
          filterTypes={filterTypes}
          setFilterTypes={setFilterTypes}
          checked={checked}
          setChecked={setChecked}
          userLocation={userLocation}
          selectedPlacesList={selectedPlacesList}
        />)}
        
        <ClusterLayer
          zoom={zoom}
          filteredVisiblePlaces={filteredVisiblePlaces}
        />
        <MarkersLayer
          zoom={zoom}
          visiblePlaces={filteredVisiblePlaces}
          selectedPlacesList={selectedPlacesList}
          setSelectedPlacesList={setSelectedPlacesList}
          setShowMoreDetails={setShowMoreDetails}
          openPopupPlaceId={openPopupPlaceId}
          setOpenPopupPlaceId={setOpenPopupPlaceId}
        />
        <RouteLayer
          routeCoordinates={routeCoordinates}
          callSubmit={callSubmit}
        />
        {userLocation && (
          <AnimatedUserLocation userLocation={userLocation} />
        )}
      </Map>
    </div>
  );
}