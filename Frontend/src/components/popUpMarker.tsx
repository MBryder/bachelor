import { Marker, Popup } from "@vis.gl/react-maplibre";
import { useState } from "react";

interface PopupMarkerProps {
    longitude: number;
    latitude: number;
    title: string;
    image?: string; // Optional image URL
    description?: string; // Optional description
    setSelectedPlacesList?: any;
    place?: any;
}

const PopupMarker = ({ longitude, latitude, title, image, description, setSelectedPlacesList, place }: PopupMarkerProps) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            {/* Emoji Marker */}
            <Marker longitude={longitude} latitude={latitude}>
                <div
                    className="relative cursor-pointer text-4xl" // Larger emoji
                    onClick={() => setShowPopup(true)}
                >
                    📍
                </div>
            </Marker>

            {/* Popup with Image and Description */}
            {showPopup && (
                <Popup
                    longitude={longitude}
                    latitude={latitude}
                    onClose={() => setShowPopup(false)}
                    closeOnClick={false}
                >
                    <div className=" bg-transparent rounded-lg max-w-[200px]">
                        {/* Title */}
                        <h3 className="font-bold text-black text-lg">{title}</h3>

                        {/* Image (optional) */}
                        {image && (
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-24 object-cover rounded-lg mt-2"
                            />
                        )}

                        {/* Description (optional) */}
                        {description && (
                            <p className="text-gray-700 text-sm mt-2">{description}</p>
                        )}

                        {/* Close Button */}
                        <button
                            className="mt-2 px-3 py-1 text-xs text-white bg-red-500 rounded"
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>
                        
                        <button
                            className="mt-2 px-3 py-1 text-xs text-white bg-green-500 rounded"
                            onClick={() => setSelectedPlacesList((prevList: any[]) => [...prevList, place])}
                        >
                            add to list
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default PopupMarker;
