import { useEffect, useState } from "react";
import { getLocationFromCoordinates } from "../../utils/reverseGeo";

const Locationcell = ({ coordinates }) => {
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
  

  export default Locationcell;