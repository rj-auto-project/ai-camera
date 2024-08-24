import {
    CameraAlt as CameraAltIcon,
    VisibilityOff as VisibilityOffIcon,
    Visibility as VisibilityIcon,
    Group as GroupIcon,
    DirectionsCar as DirectionsCarIcon,
  } from "@mui/icons-material";


  
export const chipData = [
    { label: "All Cameras", icon: <CameraAltIcon color="black" /> },
    { label: "Inactive Cameras", icon: <VisibilityOffIcon color="black" /> },
    { label: "Active Cameras", icon: <VisibilityIcon color="black" /> },
    { label: "Crowd", icon: <GroupIcon color="black" /> },
    { label: "Traffic", icon: <DirectionsCarIcon color="black" /> },
  ];
