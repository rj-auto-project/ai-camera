import React from "react";
import { Box,  Typography } from "@mui/material";
import L from "leaflet";
import {  Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapView from "../../screens/map/mapview";
import MapPieChart from "./MapPieChart";
import CustomModel from "./CustomModel";
import { classColors } from "../../constants/constant";

const MapModal = ({ isOpen, onClose, data = [], title = "Map View" }) => {


  // Create custom dot icon for each class
  const createDotIcon = (className) => {
    const color = classColors[className] || "#888888"; 

    const svgTemplate = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="6" fill="${color}" stroke="white" stroke-width="1"/>
      </svg>
    `;

    return L.divIcon({
      html: svgTemplate,
      className: "custom-dot-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };


  const center =
    data.length > 0
      ? [
          data.reduce((sum, item) => sum + item.location[0], 0) / data.length,
          data.reduce((sum, item) => sum + item.location[1], 0) / data.length,
        ]
      : [0, 0];


  return (
    <>
      <CustomModel isOpen={isOpen} onClose={onClose} title={title}>
        {/* Map container */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <MapView center={center}>
            {data.map((item, index) => {
              return (
                <Marker
                  key={index}
                  position={item.location}
                  icon={createDotIcon(item.className)}
                >
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
          <MapPieChart data={data} />
        </Box>
      </CustomModel>
    </>
  );
};

export default MapModal;
