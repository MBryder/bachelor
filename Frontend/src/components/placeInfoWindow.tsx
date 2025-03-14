import { InfoWindow } from "@react-google-maps/api";

interface PlaceInfoWindowProps {
    selectedPlace: google.maps.places.PlaceResult | null;
    setSelectedPlace: (place: google.maps.places.PlaceResult | null) => void;
    isPlaceInList: (place: google.maps.places.PlaceResult) => boolean;
    handleAddPlace: (place: google.maps.places.PlaceResult) => void;
}

function PlaceInfoWindow({ selectedPlace, setSelectedPlace, isPlaceInList, handleAddPlace }: PlaceInfoWindowProps) {
    if (!selectedPlace || !selectedPlace.geometry?.location) return null;

    return (
        <InfoWindow
            position={{
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedPlace(null)}
        >
            <div>
                <img
                    src={selectedPlace.photos?.[0]?.getUrl() || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                    alt={selectedPlace.name}
                    className="w-full h-32 object-cover rounded-md"
                />
                <h3 className="font-bold">{selectedPlace.name}</h3>
                <p>{selectedPlace.vicinity}</p>
                <p className="italic">{selectedPlace.types?.[0]}</p>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    View on Google Maps
                </a>
                {isPlaceInList(selectedPlace) ? (
                    <div className="mt-2 p-2 bg-green-500 text-white rounded text-center">
                        Already in your list
                    </div>
                ) : (
                    <button
                        onClick={() => handleAddPlace(selectedPlace)}
                        className="mt-2 p-2 bg-blue-500 text-white rounded w-full"
                    >
                        Add to List
                    </button>
                )}
            </div>
        </InfoWindow>
    );
}

export default PlaceInfoWindow;
