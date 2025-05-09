import PopupMarker from "../popUpMarker";

export default function MarkersLayer({ zoom, visiblePlaces, selectedPlacesList, setShowMoreDetails, openPopupPlaceId, setOpenPopupPlaceId }: any) {
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
            place={place}
            color={isSelected ? "blue" : "red"}
            setShowMoreDetails={setShowMoreDetails}
            openPopupPlaceId={openPopupPlaceId}
            setOpenPopupPlaceId={setOpenPopupPlaceId}
          />
        );
      })}
    </>
  );
}