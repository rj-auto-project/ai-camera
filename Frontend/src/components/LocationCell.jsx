import { useEffect, useState } from "react";
import { getLocationFromCoordinates } from "../utils/reverseGeo";

export const LocationCell = ({ coordinates }) => {
    const [location, setLocation] = useState("Loading...");
  
    useEffect(() => {
      const fetchLocation = async () => {
        if (!coordinates) {
          setLocation("Unknown");
          return;
        }
  
        const loc = await getLocationFromCoordinates(coordinates);
        setLocation(loc || "Unknown");
      };
  
      fetchLocation();
    }, [coordinates]);
  
    return <>{location}</>;
  };
  