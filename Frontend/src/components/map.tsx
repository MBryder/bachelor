import React from 'react';

import {
    AdvancedMarker,
    APIProvider,
    Map,
    MapCameraChangedEvent,
  } from '@vis.gl/react-google-maps';

import Markers from './markers';
import MarkerWithInfoWindow from './markerInfoWindow';

type Poi = {key: string, location: google.maps.LatLngLiteral}

const locations: Poi[] = [
    {key: 'København', location: {lat: 55.860664, lng: 12.208138}},
    {key: 'Det kgl bibliotek', location: {lat: 55.681209, lng: 12.575418}},
    {key: 'Det kgl teater', location: {lat: 55.679548, lng: 12.575418}},
];

function MapCreate() {
    return (
        <APIProvider apiKey={'AIzaSyCkruFvWecrOLNYhOSum0WKmHb-3dZcT5M'} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={13}
                defaultCenter={{ lat: 55.860664, lng: 12.208138 }}
                mapId='51389869f40fdb4f'
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
                    <Markers pois={locations} />
                    <MarkerWithInfoWindow/>
            </Map>
        </APIProvider>
    );
}

export default MapCreate;