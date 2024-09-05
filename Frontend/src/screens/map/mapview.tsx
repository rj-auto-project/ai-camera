import { MapContainer, TileLayer } from "react-leaflet";
import osm from "./osm-provider";
import "leaflet/dist/leaflet.css";
import "./Style.css";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import { geojson } from "../../data/mapdata.js";

const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>();

const crowddata = [
  [26.90670113368316, 75.80778836071738, 100], // Kanak Ghati, Amer Road
  [26.89916069239448, 75.81197805506888, 70], // Kheri Gate, Amer Road
  [26.89868338332008, 75.80100773627117, 40], // Intersection of Sikar Road and Amer Road
  [26.89665459752491, 75.8050294212182, 0], // Near Sanganeri Gate
  [26.9056678517506, 75.80452679452807, 30], // Near Jal Mahal, Amer Road
];

const trafficdata = [
  [26.90670113368316, 75.80778836071738, 20], // Kanak Ghati, Amer Road
  [26.89916069239448, 75.81197805506888, 90], // Kheri Gate, Amer Road
  [26.89868338332008, 75.80100773627117, 50], // Intersection of Sikar Road and Amer Road
  [26.89665459752491, 75.8050294212182, 0], // Near Sanganeri Gate
  [26.9056678517506, 75.80452679452807, 150], // Near Jal Mahal, Amer Road
];

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
          points={crowddata}
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
          points={trafficdata}
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
