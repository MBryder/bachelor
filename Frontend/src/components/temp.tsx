
return (
    <div className="flex w-full h-full">
        <Toaster />

        <div className="w-3/4 h-full rounded-xl overflow-hidden">
            {!isLoaded ? (
                <p>Loading Google Maps...</p>
            ) : (
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={center}
                    zoom={14}
                    options={{
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                    }}
                    onLoad={(mapInstance) => setMap(mapInstance)}
                    onIdle={() => handleFetchPlaces(map, setVisiblePlaces, fetchPlaces)}
                >
                    {visiblePlaces.length > 0 &&
                        visiblePlaces.map((place) =>
                            place.geometry?.location ? (
                                <Marker
                                    key={place.place_id}
                                    position={{
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                    }}
                                    onClick={() => setSelectedPlace(place)}
                                    icon={isPlaceInList(place, selectedPlacesList) ? selectedMarkerIcon : defaultMarkerIcon}
                                />
                            ) : null
                        )}

                    {/* Use the new PlaceInfoWindow component */}
                    <PlaceInfoWindow
                        selectedPlace={selectedPlace}
                        setSelectedPlace={setSelectedPlace}
                        isPlaceInList={(place) => isPlaceInList(place, selectedPlacesList)}
                        handleAddPlace={(place) => handleAddPlace(place, selectedPlacesList, setSelectedPlacesList)}
                    />
                </GoogleMap>
            )}
        </div>

        {/* Using the refactored PlacesList component */}
        <PlacesList selectedPlacesList={selectedPlacesList} setSelectedPlacesList={setSelectedPlacesList} />

        <button
                    onClick={handleSubmit}
                    className="mt-4 p-2 bg-green-500 text-white rounded w-full"
                >
                    Submit
                </button>'{minCost !== null ? (
                <div>
                    <p>Minimum Cost: {minCost}</p>
                    <p>Route: {route.join(" → ")}</p>
                </div>
            ) : (
                <p>Click the button to solve TSP.</p>
            )}'
            </div>
    );

export default Map;