import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const AnimatedMapView = ({ center, zoom, children, data }) => {
  const map = useMap();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      map.setView(data?.length ? center : [0, 0], 14);
      isInitialMount.current = false;
    } else if (center) {
      map.flyTo(center, zoom, {
        duration: 1,
        easeLinearity: 0.25,
      });
    }
  }, [ center, zoom]);

  return children;
};

export default AnimatedMapView;
