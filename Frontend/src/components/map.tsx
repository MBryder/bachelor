import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo} from "react";

const MAP_API_KEY = import.meta.env.VITE_MAP_KEY; // Replace with your API key

function Map() {
    // Load Google Maps API
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
    });

    // Define a default location = Marcus' lejlighed.
    const center = useMemo(() => ({ lat: 55.6632, lng: 12.5939 }), []);

        // Define locations with markers
    const locations = [
        { id: 1, name: "Marcus' Lejlighed", lat: 55.6632, lng: 12.5939 },
        { id: 2, name: "Tivoli Gardens", lat: 55.6737, lng: 12.5681 },
        { id: 3, name: "Nyhavn", lat: 55.6806, lng: 12.5885 },
        { id: 4, name: "The Little Mermaid", lat: 55.6929, lng: 12.5993 },
    ];

    const mapOptions = {
        mapTypeControl: false,       // Hides 'Kort' and 'Satellit'
        fullscreenControl: false,    // Hides fullscreen button
        streetViewControl: false,    // Hides Street View pegman
    };
    

    return (
        <div className="w-full h-full">
            {!isLoaded ? (
                <p>Loading Google Maps...</p>
            ) : (
                <div className="relative w-full h-full">
                    
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={center}
                        zoom={12} // Set a good zoom level
                        options={mapOptions}
                    >
                        
                        {/* Add Markers */}
                        {locations.map((location) => (
                            <Marker
                                key={location.id}
                                position={{ lat: location.lat, lng: location.lng }}
                            />
                        ))}
                    </GoogleMap>
                    <div className="absolute top-4 left-4 transform w-[300px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search location..."
                            className="w-full p-2 px-4 bg-background-beige3 rounded-3xl shadow-md focus:outline-none text-paragraph-1"
                        />
                    </div>
                </div>

                
            )}
        </div>
    );
}

export default Map;