import React from "react";
import { place } from "../../utils/types";
import { useFlyToLocation } from "../../utils/flyTo";

interface Props {
  selectedPlacesList: place[];
  handleSetAsStart: (index: number) => void;
  handleRemove: (index: number) => void;
}

const SelectedPlaceList: React.FC<Props> = ({ selectedPlacesList, handleSetAsStart, handleRemove }) => {
  const flyToLocation = useFlyToLocation();

  return (
    <ul className="px-2 overflow-y-auto h-fit scrollbar flex-[6]">
      {selectedPlacesList.map((place, index) => (
        <li
          key={index}
          className="pb-2 my-2 border-b flex items-center justify-between border-primary-brown"
          onClick={() => flyToLocation(place.longitude, place.latitude)}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-primary-brown text-heading-4">
                {place.name}
                {index === 0 && (
                  <span className="text-xs text-primary-brown/60 ml-1 italic">
                    (starting place)
                  </span>
                )}
              </h2>
              <p>{place.address}</p>
            </div>
            <div className="flex items-center gap-2">
              {index !== 0 && (
                <button
                  onClick={e => { e.stopPropagation(); handleSetAsStart(index); }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Set as start
                </button>
              )}
              <button
                className="text-sm hover:text-red-600 text-primary-brown self-end"
                onClick={e => { e.stopPropagation(); handleRemove(index); }}
              >
                X
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SelectedPlaceList;
