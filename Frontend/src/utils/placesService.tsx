// src/utils/placesService.ts

const entertainmentTypes = [
    "amusement_park",
    "aquarium",
    "art_gallery",
    "bowling_alley",
    "casino",
    "movie_theater",
    "museum",
    "night_club",
    "stadium",
    "tourist_attraction",
    "zoo",
];

export const fetchPlaces = (
    map: google.maps.Map | null,
    setVisiblePlaces: (places: google.maps.places.PlaceResult[]) => void
) => {
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const service = new google.maps.places.PlacesService(map);

    const searchPromises = entertainmentTypes.map((type) =>
        new Promise((resolve) => {
            service.nearbySearch({ bounds, type }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    resolve([]);
                }
            });
        })
    );

    Promise.all(searchPromises).then((resultsArray) => {
        const combinedResults = resultsArray.flat() as google.maps.places.PlaceResult[];

        // Remove duplicates based on place_id
        const uniqueResults: google.maps.places.PlaceResult[] = combinedResults.filter(
            (place, index, self) =>
                index === self.findIndex((p) => p.place_id === place.place_id)
        );

        setVisiblePlaces(uniqueResults);
    });
};