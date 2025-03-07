// src/utils/placesService.ts

interface Place {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeUrl: string;
    type: string;
    photoUrl?: string;
}

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
    setVisiblePlaces: (places: Place[]) => void
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

        processResults(uniqueResults, setVisiblePlaces);
    });
};

const processResults = (
    results: google.maps.places.PlaceResult[],
    setVisiblePlaces: (places: Place[]) => void
) => {
    if (!results) return;

    const places: Place[] = results.map((place) => ({
        id: place.place_id || "",
        name: place.name || "Unknown",
        address: place.vicinity || "No Address",
        lat: place.geometry?.location?.lat() ?? 0,
        lng: place.geometry?.location?.lng() ?? 0,
        placeUrl: place.place_id
            ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
            : "#",
        type: place.types?.[0] || "Unknown",
        photoUrl:
            place.photos?.[0]?.getUrl() ||
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    }));

    setVisiblePlaces(places);
};
