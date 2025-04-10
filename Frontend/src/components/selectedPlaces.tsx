import { useState, useEffect } from "react";
import { getTourismIcon } from "../utils/icons";

function Selectedbar({ selectedPlaces, Submit, showSidebar, setShowSidebar }: {
  selectedPlaces: any[];
  Submit: () => void;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}) {
  return (
    <div className="h-1/2 flex items-center py-2">
      <div
        className={`transition-all duration-500 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex`}
      >
        <div className="h-full w-full">
          <h1 className="text-heading-1 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown h-2/20 text-center justify-center flex items-center">
            Selected places
          </h1>
          <ul className="px-2 overflow-y-auto h-32/40 scrollbar">
            {selectedPlaces.map((place: any) => (
              <li key={place.id} className="pb-2 my-2 border-b border-primary-brown flex items-center">
                <div className="mr-2">{getTourismIcon(place.properties.tourism)}</div>
                <div>
                  <h2 className="text-primary-brown text-heading-4">{place.properties.name}</h2>
                  <p>{place.properties.address}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-2 px-4 h-4/40 border-t-2 border-primary-brown flex items-center justify-center">
            <button onClick={Submit} className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-full">
              <p className="text-primary-brown text-heading-4">Submit</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selectedbar;
