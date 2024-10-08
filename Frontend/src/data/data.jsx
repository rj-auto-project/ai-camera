import {
  CameraAlt as CameraAltIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  Group as GroupIcon,
  DirectionsCar as DirectionsCarIcon,
} from "@mui/icons-material";
import { FaCamera, FaCar, FaUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import CarCrashOutlinedIcon from "@mui/icons-material/CarCrashOutlined";

export const chipData = [
  { label: "All Cameras", icon: <CameraAltIcon color="black" /> },
  { label: "Inactive Cameras", icon: <VisibilityOffIcon color="black" /> },
  { label: "Active Cameras", icon: <VisibilityIcon color="black" /> },
  { label: "Crowd", icon: <GroupIcon color="black" /> },
  { label: "Traffic", icon: <DirectionsCarIcon color="black" /> },
];

export const operations = [
  { name: "Vehicle Search", icon: <FaCar size={18} /> },
  { name: "Suspect Search", icon: <FaUser size={18} /> },
  { name: "Restricted Vehicle", icon: <CarCrashOutlinedIcon size={18} /> },
  { name: "Crowd Restriction", icon: <FaPeopleGroup size={18} /> },
];


export const settingsOptions = [
  { name: "User", icon: <FaUser size={18} /> },
  { name: "Camera", icon: <FaCamera size={18} /> },
 
];

