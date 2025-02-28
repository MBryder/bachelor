import { useState } from "react";
import Head from "../components/header";
import Map from "../components/map";

interface Place {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeUrl: string;
}

function Home() {
    const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([]);

    return (
        <div className="bg-background-beige1 h-screen text-text-dark px-8 flex-row">
            <Head />
            <div className="h-[70px] border-b-2 border-primary-brown flex items-center justify-between px-8">
                <div className="flex items-center space-x-4 h-[50px]">
                    <button className="border-2 border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-[110px]">
                        <p className=" text-primary-brown text-heading-4 ">Filter</p>
                    </button>
                </div>
            </div>
            <div className="flex h-[calc(100%-150px)]">
                <div className="w-2/3 border-r border-gray-300">
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full h-full border border-gray-300">
                            <Map setVisiblePlaces={setVisiblePlaces} />
                        </div>
                    </div>
                </div>

                <div className="w-1/3 overflow-y-auto p-4 h-full scrollbar">
                    <h2 className="text-lg font-bold mb-2">Visible Locations</h2>
                    {visiblePlaces.length > 0 ? (
                        <ul>
                            {visiblePlaces.map((place) => (
                                <li key={place.id} className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded">
                                    <h3 className="font-bold">{place.name}</h3>
                                    <p>{place.address}</p>
                                    <a
                                        href={place.placeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View on Google Maps
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No locations visible.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
