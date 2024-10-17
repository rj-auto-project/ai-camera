import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Fab } from "@mui/material";
import { useMap } from "react-leaflet";

const CenterButton = ({ center }) => {
  const map = useMap();

  const handleCenterClick = () => {
    map.flyTo(center, 17, { animate: true, duration: 2 });
  };

  return (
    <Fab
      color="white"
      aria-label="center"
      size="small"
      style={{
        position: "absolute",
        bottom: "30px",
        right: "10px",
        zIndex: 1000,
        cursor: "pointer",
      }}
      onClick={handleCenterClick}
    >
      <MyLocationIcon style={{ fontSize: "20px" }} />
    </Fab>
  );
};

export default CenterButton;
