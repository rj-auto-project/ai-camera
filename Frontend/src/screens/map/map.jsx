import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import MapView from './MapView';

const Map = () => {
  const center = [51.505, -0.09]; 
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapView
        center={center}
        DEFAULT_ZOOM={18}
      >
        <Marker position={center}>
          <Popup>Camera</Popup>
        </Marker>
      </MapView>
    </div>
  );
};

export default Map;
