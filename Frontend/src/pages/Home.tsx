import { useState } from "react";
import Head from "../components/header";
import Map from "../components/map";
import { fetchPlaceById } from "../services/placesService";

function Home() {
    const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);
    const [selectedPlacesList, setSelectedPlacesList] = useState<any[]>([]);

    const handleAddPlace = async (place: any) => {
        const resultPlace = await fetchPlaceById(place.placeId);
        setSelectedPlacesList(prev => [...prev, resultPlace]);
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
