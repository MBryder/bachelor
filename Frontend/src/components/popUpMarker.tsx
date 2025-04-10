import { Marker } from "@vis.gl/react-maplibre";
import { useState } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import CustomPopup from "./CustomPopup";

const PopupMarker = ({
  longitude,
  latitude,
  title,
  image,
  description,
  setSelectedPlacesList,
  place,
}: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const { current: map } = useMap();

  const handleClick = () => {
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        duration: 1000,
        easing: (t) => t * (2 - t),
        essential: true,
      });
    }
    setShowPopup(true);
  };

  return (
    <>
      <Marker longitude={longitude} latitude={latitude}>
        <div
          className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"
          onClick={handleClick}
        />
      </Marker>

      {showPopup && (
        <CustomPopup
          longitude={longitude}
          latitude={latitude}
          onClose={() => setShowPopup(false)}
        >
          <h3 className="font-bold text-black text-lg">{title}</h3>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-24 object-cover rounded-lg mt-2"
            />
          )}
          {description && (
            <p className="text-gray-700 text-sm mt-2">{description}</p>
          )}
          <button
            className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-full"
            onClick={() =>
              setSelectedPlacesList?.((prevList: any[]) => [...prevList, place])
            }
          >
            Add to list
          </button>
        </CustomPopup>
      )}
    </>
  );
};

export default PopupMarker;
