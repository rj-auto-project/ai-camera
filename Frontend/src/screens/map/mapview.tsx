import { MapContainer, TileLayer } from "react-leaflet";
import osm from "./osm-provider.js";
import "leaflet/dist/leaflet.css";
import "./Style.css";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>();

const MapView = ({
  center,
  DEFAULT_ZOOM,
  heatmapData,
  mapRef,
  children,
  activeCategory,
  camStatus,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      maxZoom={18}
      style={{ width: "100%", height: "100%" }}
      ref={mapRef}
      zoomControl={false}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={osm.maptiler.attributions}
      />
      {children}
      {activeCategory === "Crowd" && (
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={heatmapData}
          radius={20}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => m[2]}
          max={50}
          blur={15}
        />
      )}

      {activeCategory === "Traffic" && (
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={heatmapData}
          radius={20}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => m[2]}
          max={50}
          blur={15}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
