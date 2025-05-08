import PopupMarker from "../popUpMarker";

export default function MarkersLayer({ zoom, visiblePlaces, selectedPlacesList, setSelectedPlacesList, setShowMoreDetails }: any) {
  if (zoom < 14) return null;

  const allMarkers = [...selectedPlacesList, ...visiblePlaces.filter(
    (vp: any) => !selectedPlacesList.some((sp: any) => sp.placeId === vp.placeId)
  )];

  return (
    <>
      {allMarkers.map((place: any) => {
        const isSelected = selectedPlacesList.some((sp: any) => sp.placeId === place.placeId);
        return (
          <PopupMarker
            key={place.placeId}
            longitude={place.longitude}
            latitude={place.latitude}
            title={place.name}
            image={place.images?.[0]?.imageUrl || "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=826"}
            description={place.details?.editorialOverview || "No description available."}
            setSelectedPlacesList={setSelectedPlacesList}
            place={place}
            color={isSelected ? "blue" : "red"}
            setShowMoreDetails={setShowMoreDetails}
          />
        );
      })}
    </>
  );
}