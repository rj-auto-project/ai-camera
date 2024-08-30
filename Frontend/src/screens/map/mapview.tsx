import { MapContainer, TileLayer } from "react-leaflet";
import osm from "./osm-provider";
import "leaflet/dist/leaflet.css";
import "./Style.css";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import { geojson } from "../../data/mapdata.js";

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>();

const data = [
 // Near Jal Mahal, Amer Road
];

const MapView = ({ center, DEFAULT_ZOOM, heatmapData, mapRef, children }) => (
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
    <HeatmapLayer
      points={data}
      radius={20}
      longitudeExtractor={(m) => m[1]} // Extracting longitude
      latitudeExtractor={(m) => m[0]} // Extracting latitude
      intensityExtractor={(m) => m[2]}
    />
  </MapContainer>
);

export default MapView;
