import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    AdvancedMarker,
    useMap,
    Pin,
    InfoWindow,
    useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';

type Poi = { key: string, location: google.maps.LatLngLiteral };

const Markers = (props: { pois: Poi[] }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    // Initialize MarkerClusterer, if the map has changed
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers, if the markers array has changed
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    const [infowindowOpen, setInfowindowOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

    const handleClick = useCallback((marker: Marker, location: google.maps.LatLngLiteral) => {
        setSelectedMarker(marker);
        setSelectedLocation(location);
        setInfowindowOpen(true);
    }, []);

    return (
        <>
            {props.pois.map((poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={() => handleClick(markers[poi.key], poi.location)}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}

            {infowindowOpen && selectedMarker && selectedLocation && (
                <InfoWindow
                    anchor={selectedMarker}
                    maxWidth={200}
                    onCloseClick={() => setInfowindowOpen(false)}
                >
                    <div>
                        <p>Den lille fissefrue</p>
                        <p>Latitude: {selectedLocation.lat}</p>
                        <p>Longitude: {selectedLocation.lng}</p>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

export default Markers;