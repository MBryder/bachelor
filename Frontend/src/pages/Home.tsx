import {useState } from "react";
import Head from "../components/header";
import Map from "../components/map";

function Home() {
    const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);
    const [selectedPlacesList, setSelectedPlacesList] = useState<any[]>([]);

    const handleAddPlace = (place: any) => {
        const exists = selectedPlacesList.some(p => p.properties?.id === place.id);
        if (!exists) {
            const newPlaceFeature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [place.longitude, place.latitude],
                },
                properties: {
                    ...place,
                },
            };
            setSelectedPlacesList(prev => [...prev, newPlaceFeature]);
        }
    };

    return (
        <div className="bg-background-beige1 h-screen text-text-dark flex-row">
            <Head handleAddPlace={handleAddPlace} />
            <div className="flex h-[calc(100%-60px)]">
                <Map
                    setVisiblePlaces={setVisiblePlaces}
                    visiblePlaces={visiblePlaces}
                    selectedPlacesList={selectedPlacesList}
                    setSelectedPlacesList={setSelectedPlacesList}
                />
            </div>
        </div>
    );
}

export default Home;
