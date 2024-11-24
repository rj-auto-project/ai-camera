import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
// Fix import order
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet.heat/dist/leaflet-heat.js';
import './leaflet-custom.css'
// Fix leaflet default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Styles using camelCase
const mapStyles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#f5f5f5'
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  leafletContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    outline: 'none'
  }
};

// HeatmapLayer component
const HeatmapLayer = ({ points, options }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!points?.length) return;

    const formattedPoints = points.map(point => [
      point[0], // latitude
      point[1], // longitude
      point[2]  // intensity
    ]);

    const heatLayer = L.heatLayer(formattedPoints, {
      radius: 20,
      blur: 15,
      maxZoom: 18,
      max: 50,
      ...options
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
};

const MapView = ({
  center = [51.505, -0.09],
  DEFAULT_ZOOM = 13,
  heatmapData,
  mapRef,
  children,
  activeCategory,
}) => {
  const showHeatmap = React.useMemo(() => {
    return ['Crowd', 'Traffic'].includes(activeCategory) && 
           heatmapData?.results?.length > 0;
  }, [activeCategory, heatmapData]);

  const renderMap = () => (
    <div style={mapStyles.wrapper}>
      <div style={mapStyles.mapContainer}>
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          maxZoom={18}
          ref={mapRef}
          zoomControl={false}
          style={mapStyles.leafletContainer}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {children}
          
          {showHeatmap && (
            <HeatmapLayer
              points={heatmapData.results}
              options={{
                radius: 20,
                blur: 15,
                maxZoom: 18,
                max: 50,
                gradient: {
                  0.4: '#1E40AF',
                  0.6: '#06B6D4',
                  0.7: '#84CC16',
                  0.8: '#FCD34D',
                  1.0: '#EF4444'
                }
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );

  if (!heatmapData?.results || heatmapData?.results?.length === 0) {
    return renderMap();
  }

  return renderMap();
};

export default MapView;