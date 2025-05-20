import { useRef, useState } from "react";
import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useUserLocation } from "../../hooks/useUserLocation";
import AnimatedUserLocation from "./AnimatedUserLocation";
import { useSelectedPlaces } from "../../context/SelectedPlacesContext";
import useMapListeners from "../../hooks/useMapListeners";
import useShareLoader from "../../hooks/useShareLoader";
import UIOverlay from "./UIOverlay";
import ClusterLayer from "./ClusterLayer";
import MarkersLayer from "./MarkersLayer";
import RouteLayer from "./RouteLayer";



interface MapWrapperProps {
  showOverlay: boolean;
}

export default function MapWrapper({ showOverlay }: MapWrapperProps) {
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);


  const [zoom, setZoom] = useState(12);
  const [checked, setChecked] = useState(false);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");
  const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);
  const [openPopupPlaceId, setOpenPopupPlaceId] = useState<string | null>(null);

  const userLocation = useUserLocation();
  const { selectedPlacesList, setSelectedPlacesList } = useSelectedPlaces();

  if (showOverlay) {useMapListeners(mapRef, setZoom, setVisiblePlaces, mapLoaded);}
  else {useShareLoader(mapRef, setZoom, mapLoaded);}

  const filteredVisiblePlaces = filterTypes.length > 0
    ? visiblePlaces.filter((place: any) =>
        place.details?.types?.some((type: string) => filterTypes.includes(type))
      )
    : visiblePlaces;

  

  return (
    <div className="flex w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 12.5939, latitude: 55.6632, zoom: zoom }}
        mapStyle="https://api.maptiler.com/maps/bright/style.json?key=L0M8KVYaAAuKx695rSCS"
        onLoad={() => setMapLoaded(true)}
      >
        {showOverlay && (
          <div className="w-full h-full flex">
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
            />
            
            <ClusterLayer
              zoom={zoom}
              filteredVisiblePlaces={filteredVisiblePlaces}
            />
          </div>
          )}
        <MarkersLayer
          showOverlay={showOverlay}
          zoom={zoom}
          visiblePlaces={filteredVisiblePlaces}
          selectedPlacesList={selectedPlacesList}
          setSelectedPlacesList={setSelectedPlacesList}
          setShowMoreDetails={setShowMoreDetails}
          openPopupPlaceId={openPopupPlaceId}
          setOpenPopupPlaceId={setOpenPopupPlaceId}
        />
        <RouteLayer/>
        {userLocation && (
          <AnimatedUserLocation userLocation={userLocation} />
        )}
      </Map>
    </div>
  );
}