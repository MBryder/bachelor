import VisiblePlaces from "../visiblePlaces";
import Selectedbar from "../selectedPlaces";
import Filter from "../filter";
import { toast } from "react-hot-toast";
import { place } from "../../utils/types";

export default function UIOverlay({
  visiblePlaces,
  setSelectedPlacesList,
  showMoreDetails,
  setShowMoreDetails,
  filterTypes,
  setFilterTypes,
  callSubmit,
  checked,
  setChecked,
  userLocation,
  selectedPlacesList
}: any) {
  const handleChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (!userLocation) {
      toast.error("User location not available yet.");
      return;
    }

    const userLocationPlace = {
      id: "user-location",
      placeId: "user-location",
      name: "Your Location",
      details: {},
      latitude: userLocation.lat,
      longitude: userLocation.lng,
    };

    if (newChecked) {
      const alreadyAdded = selectedPlacesList.some((p: place) => p?.placeId === "user-location");
      if (!alreadyAdded) setSelectedPlacesList([userLocationPlace, ...selectedPlacesList]);
    } else {
      const updatedList = selectedPlacesList.filter((p: any) => p?.placeId !== "user-location");
      setSelectedPlacesList(updatedList);
    }
  };

  return (
    <div className="flex flex-row h-full w-full justify-between items-start">
      <div className="flex flex-row h-full w-full justify-start items-start">
        <VisiblePlaces
          visiblePlaces={visiblePlaces}
          fetchPlaces={() => {}}
          setSelectedPlacesList={setSelectedPlacesList}
          showMoreDetails={showMoreDetails}
          setShowMoreDetails={setShowMoreDetails}
        />
        <Filter filterTypes={filterTypes} setFilterTypes={setFilterTypes} />
      </div>
      <Selectedbar Submit={callSubmit} handleChange={handleChange} visiblePlaces={visiblePlaces} />
    </div>
  );
}