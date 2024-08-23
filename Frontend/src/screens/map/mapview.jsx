import { MapContainer, TileLayer } from "react-leaflet";
import osm from "./osm-provider";
import "leaflet/dist/leaflet.css";
import "./Style.css"


const MapView = ({ center, DEFAULT_ZOOM, mapRef, children }) => (
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
  </MapContainer>
);

export default MapView;
