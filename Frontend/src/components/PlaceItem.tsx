import React from "react";

interface PlaceItemProps {
    place: google.maps.places.PlaceResult;
    index: number;
    handleDragStart: (index: number) => void;
    handleDragOver: (index: number) => void;
    handleDragEnd: () => void;
    handleDeletePlace: (placeId: string) => void;
}

const PlaceItem: React.FC<PlaceItemProps> = ({
    place,
    index,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDeletePlace,
}) => {
    return (
        <li
            className="mb-4 border border-black"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOver(index)}
            onDragEnd={handleDragEnd}
        >
            <h3 className="font-bold">{place.name}</h3>
            <p>{place.vicinity}</p>
            <p className="italic">{place.types?.[0]}</p>
            <button
                onClick={() => handleDeletePlace(place.place_id!)}
                className="mt-2 p-2 bg-red-500 text-white rounded"
            >
                Delete
            </button>
        </li>
    );
};

export default PlaceItem;