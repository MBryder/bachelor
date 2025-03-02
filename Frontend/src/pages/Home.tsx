import { useState } from "react";
import Head from "../components/header";
import Map from "../components/map";
import image from "../assets/Jens.jpg";

interface Place {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeUrl: string;
}


function Test() {
    const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([]);

    return (
        <div className="bg-background-beige1 h-screen text-text-dark flex-row">
            <Head />
            <div className="flex h-[calc(100%-60px)]">
                <div className="w-7/16 overflow-y-auto p-4 scrollbar">
                    {visiblePlaces.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {visiblePlaces.map((place) => (
                                <div key={place.id} className=" min-w-[150px] flex flex-col p-2 ">
                                    <div className="aspect-square w-full flex justify-center items-center">
                                        <img
                                            src={image} 
                                            className="size-full object-cover rounded-2xl" 
                                        />
                                    </div>
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No locations visible.</p>
                    )}
                </div>
                
                <div className="w-auto h-full flex-grow">
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full h-full">
                            <Map setVisiblePlaces={setVisiblePlaces} />
                        </div>
                    </div>
                </div>

                
            </div>
        </div>

    );
};

export default Test;