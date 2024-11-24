import React, { useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import L from 'leaflet';
import { Minimize2, Maximize2, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapView from "../../screens/map/mapview";
import MapPieChart from "./MapPieChart";

const MapModal = ({ isOpen, onClose, data = [], title = "Map View" }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const modalStyle = {
    position: "fixed",
    top: isMaximized ? 0 : "50%",
    left: isMaximized ? 0 : "50%",
    transform: isMaximized ? "none" : "translate(-50%, -50%)",
    width: isMaximized ? "100vw" : "80vw",
    height: isMaximized ? "100vh" : "80vh",
    backgroundColor: "background.paper",
    zIndex: 1300,
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
  };



  const classColors = {
    "traffic-poles": "#FF5733",      // Bright Orange-Red
    "electric-poles": "#FFD700",     // Golden Yellow
    "telephone-poles": "#4169E1",    // Royal Blue
    "water-logging": "#1E90FF",      // Dodger Blue
    "garbage": "#8B4513",            // Saddle Brown
    "hoarding": "#9932CC",           // Dark Orchid
    "public-toilets": "#2E8B57",     // Sea Green 
    "broken-drainage": "#4B0082",    // Indigo
    "fault-manholes": "#CD853F",     // Peru
    "potholes": "#DC143C",           // Crimson
    "cracks": "#FF8C00",            // Dark Orange
    "broken-road-side": "#006400",   // Dark Green
    "broken-divider": "#8B008B"      // Dark Magenta
  };

  // Create custom dot icon for each class
  const createDotIcon = (className) => {
    const color = classColors[className] || "#888888"; // Default gray for unknown classes
    
    const svgTemplate = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="6" fill="${color}" stroke="white" stroke-width="1"/>
      </svg>
    `;

    return L.divIcon({
      html: svgTemplate,
      className: "custom-dot-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  console.log(data)

  const center =
    data.length > 0
      ? [
          data.reduce((sum, item) => sum + item.location[0], 0) / data.length,
          data.reduce((sum, item) => sum + item.location[1], 0) / data.length,
        ]
      : [0, 0];

  console.log(data);

  return (
    <>
      <Box component={Paper} elevation={24} sx={modalStyle}>
        {/* Title bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            py: 1,
            cursor: "move",
          }}
        >
          <Typography variant="subtitle1" component="div">
            {title}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={() => setIsMaximized(!isMaximized)}
              sx={{ mr: 1 }}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </Box>
        </Box>

        {/* Map container */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <MapView center={center}>
            {data.map((item, index) => {
              return (
                <Marker key={index} position={item.location}  icon={createDotIcon(item.className)}>
                  <Popup>
                    <Typography variant="body2">
                      Class: {item.className}
                      <br />
                      Distance: {item.distance}m
                    </Typography>
                  </Popup>
                </Marker>
              );
            })}
          </MapView>
          <MapPieChart data={data}/>
        </Box>
      </Box>

      {/* Backdrop */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1200,
        }}
        onClick={onClose}
      />
    </>
  );
};

export default MapModal;
