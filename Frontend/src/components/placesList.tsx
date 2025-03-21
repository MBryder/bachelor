import { useState } from "react";
import toast from 'react-hot-toast';

interface PlacesListProps {
    selectedPlacesList: any[];
    setSelectedPlacesList: (places: any[] | ((prevList: any[]) => any[])) => void;
}

function PlaceItem({ place, index, handleDeletePlace }: {
    place: any,
    index: number,
    handleDeletePlace: (index: number) => void}) 
{
    return (
        <li
            className="mb-2 p-2 bg-white rounded-md shadow flex justify-between items-center"
            onClick={() => handleDeletePlace(index)}
        >
            <div>
                <h3 className="font-bold">{place.properties.name}</h3>
                <p>{place.properties.address || "Unknown Address"}</p>
            </div>
            <div className="bg-red-500 text-white rounded p-2">Click to Delete</div>
        </li>
    );
}


export default function PlacesList({ selectedPlacesList, setSelectedPlacesList }: PlacesListProps) {

    const handleDeletePlace = (index: number) => {
        const place = selectedPlacesList[index];
        setSelectedPlacesList((prevList: any[]) =>
            prevList.filter((_, i: number) => i !== index)
        );
        toast(`${place.properties.name} removed from your list`, {
            icon: '🗑️',
            duration: 3000,
            position: 'top-right',
        });
    };

    return (
        <div className="w-1/4 h-full p-4 overflow-y-auto">
                <ul>
                    {selectedPlacesList.map((place, index) => (
                        <PlaceItem key={place.properties.id || index} place={place} index={index} handleDeletePlace={handleDeletePlace} />
                    ))}
                </ul>
        </div>
    );
}
