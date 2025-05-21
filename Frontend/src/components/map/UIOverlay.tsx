import VisiblePlaces from "../visiblePlaces";
import Selectedbar from "../Selectedbar/Selectedbar";
import Selectedbar2 from "../selectedPlaces";
import Filter from "../filter";


export default function UIOverlay({
  visiblePlaces,
  setSelectedPlacesList,
  showMoreDetails,
  setShowMoreDetails,
  filterTypes,
  setFilterTypes,
}: any) {


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
      <Selectedbar/>
    </div>
  );
}