import {Map} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css'; // See notes below
import { useMemo, useState} from "react";
import { Toaster } from "react-hot-toast";
import PlacesList from "./placesList";


function mapcomponent() {
    

    const [selectedPlacesList, setSelectedPlacesList] = useState<google.maps.places.PlaceResult[]>([]);

    const handleSubmit = () => {
        console.log("Submit button clicked", selectedPlacesList);
    };

    return (
        <div className="flex w-full h-full">
            <Toaster />

            <div className="w-3/4 h-full rounded-xl overflow-hidden">
                <Map
                    initialViewState={{
                    longitude: 12.5939,
                    latitude: 55.6632,
                    zoom: 10
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/bright"
                />
            </div>

            {/* Using the refactored PlacesList component */}
            <PlacesList selectedPlacesList={selectedPlacesList} setSelectedPlacesList={setSelectedPlacesList} />

            <button
                onClick={handleSubmit}
                className="absolute bottom-4 right-4 px-6 py-3 bg-green-500 text-white font-bold rounded shadow-lg"
            >
                Submit
            </button>
        </div>
    );
}

export default mapcomponent;