import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

function SortableItem({ place, index, handleDeletePlace }: {
    place: any,
    index: number,
    handleDeletePlace: (index: number) => void})
{
    const id = place.properties.id || `place-${index}`;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="mb-2 p-2 bg-white rounded-md shadow flex justify-between items-center cursor-grab"
        >
            <div>
                <h3 className="font-bold">{place.properties.name}</h3>
                <p>{place.properties.address || "Unknown Address"}</p>
            </div>
            <div className="text-gray-500">
                <div className=" bg-yellow-300 w-6 h-6" onClick={() => handleDeletePlace(index)}>🗑️
                </div>
                Drag to reorder
            </div>
        </li>
    );
}

export default function PlacesList({ selectedPlacesList, setSelectedPlacesList }: PlacesListProps) {
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setSelectedPlacesList((places: any[]) => {
                const oldIndex = places.findIndex((place) =>
                    place.properties.id === active.id || (!place.properties.id && `place-${places.indexOf(place)}` === active.id)
                );
                const newIndex = places.findIndex((place) =>
                    place.properties.id === over.id || (!place.properties.id && `place-${places.indexOf(place)}` === over.id)
                );

                return arrayMove(places, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="w-1/4 h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Selected Places</h2>
                <button
                    onClick={() => setIsDeleteMode(!isDeleteMode)}
                    className={`px-4 py-2 rounded ${isDeleteMode ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}
                >
                    {isDeleteMode ? 'Arrange Mode' : 'Delete Mode'}
                </button>
            </div>

            {isDeleteMode ? (
                <ul>
                    {selectedPlacesList.map((place, index) => (
                        <PlaceItem key={place.properties.id || index} place={place} index={index} handleDeletePlace={handleDeletePlace} />
                    ))}
                </ul>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={selectedPlacesList.map((place, index) => place.properties.id || `place-${index}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <ul>
                            {selectedPlacesList.map((place, index) => (
                                <SortableItem key={place.properties.id || index} place={place} index={index} handleDeletePlace={handleDeletePlace}/>
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
