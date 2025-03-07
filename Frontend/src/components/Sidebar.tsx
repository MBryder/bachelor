import React from "react";
import PlaceItem from "../components/PlaceItem";

interface SidebarProps {
    selectedPlaces: google.maps.places.PlaceResult[];
    setSelectedPlaces: React.Dispatch<React.SetStateAction<google.maps.places.PlaceResult[]>>;
    handleDeletePlace: (placeId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPlaces, setSelectedPlaces, handleDeletePlace }) => {
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggedItemIndex === null) return;

        const draggedOverItem = selectedPlaces[index];

        if (draggedOverItem === selectedPlaces[draggedItemIndex]) return;

        const items = [...selectedPlaces];
        const [draggedItem] = items.splice(draggedItemIndex, 1);
        items.splice(index, 0, draggedItem);

        setDraggedItemIndex(index);
        setSelectedPlaces(items);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    return (
        <div className="w-1/4 h-full p-4 bg-gray-100 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Selected Places</h2>
            <ul>
                {selectedPlaces.map((place, index) => (
                    <PlaceItem
                        key={place.place_id}
                        place={place}
                        index={index}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDragEnd={handleDragEnd}
                        handleDeletePlace={handleDeletePlace}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;