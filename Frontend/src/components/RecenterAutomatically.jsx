import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const RecenterAutomatically = ({ center, activeCategory }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 15, { animate: true, duration: 1.5 });
  }, [center, map, activeCategory]);

  return null;
};


export default RecenterAutomatically;
