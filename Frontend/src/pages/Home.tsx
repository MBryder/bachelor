import { useState } from "react";
import Head from "../components/header";
import MapComponent from "../components/map";

function Home() {
    const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);

    return (
        <div className="bg-background-beige1 h-screen text-text-dark flex flex-col">
            <Head />
            <div className="flex h-[calc(100%-60px)]">
                {/* Left Side: Places List */}
                <div className="w-1/3 overflow-y-auto p-4 scrollbar bg-white shadow-lg rounded-r-lg">
                    <h2 className="text-lg font-bold mb-4">Visible Places</h2>
                    {visiblePlaces.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {visiblePlaces.map((place) => (
                                <div key={place.properties.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                                    <h3 className="font-semibold">{place.properties.name || "Unknown"}</h3>
                                    <p className="text-sm text-gray-600">{place.properties.address || "Unknown"}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No locations visible.</p>
                    )}
                </div>

                {/* Right Side: Map */}
                <div className="flex-grow">
                    <MapComponent setVisiblePlaces={setVisiblePlaces} visiblePlaces={visiblePlaces} />
                </div>
            </div>
        </div>
    );
}

export default Home;
