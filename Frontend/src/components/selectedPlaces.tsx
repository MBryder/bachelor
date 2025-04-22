import { useState } from "react";
import { getTourismIcon } from "../utils/icons";

function Selectedbar({
  selectedPlaces,
  Submit,
  handleChange,
  setSelectedPlacesList,
}: {
  selectedPlaces: any[];
  setSelectedPlacesList: (places: any[]) => void;
  Submit: () => void;
  handleChange: (value: boolean) => void;
}) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
    handleChange(checked);
  };

  const handleRemove = (indexToRemove: number) => {
    const updatedList = selectedPlaces.filter((_, index) => index !== indexToRemove);
    setSelectedPlacesList([...updatedList]); // Force immutability
  };

  return (
    <div className="h-1/2 flex items-center py-2 px-2">
      <div className="translate-x-0 h-full w-[300px] border-1 bg-background-beige1 shadow-lg rounded-4xl m-2 ml-4 flex">
        <div className="h-full w-full flex flex-col">
          <h1 className="flex-1 text-heading-1 font-display border-b-2 rounded-t-4xl border-primary-brown text-primary-brown text-center justify-center flex items-center">
            Selected places
          </h1>
          <ul className="px-2 overflow-y-auto h-fit scrollbar flex-[6]">
          {selectedPlaces.map((place: any, index: number) => (
              <li
                key={index}
                className="pb-2 my-2 border-b border-primary-brown flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="mr-2">{getTourismIcon(place.properties.tourism)}</div>
                  <div>
                    <h2 className="text-primary-brown text-heading-4">{place.properties.name}</h2>
                    <p>{place.properties.address}</p>
                  </div>
                </div>
                <button
                  className="ml-2 text-sm text-red-600 hover:underline"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="p-2 px-4 flex-1 border-t-2 border-primary-brown flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
              />
              Use current locations as starting point
            </label>
            <button
              onClick={Submit}
              className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-full"
            >
              <p className="text-primary-brown text-heading-4">Submit</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selectedbar;
