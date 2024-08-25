import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import MapView from "./MapView";
import { useFetchCameras } from "../../api/api";
import { calculateCenter } from "../../utils/calculateCenter";
import DraggablePanel from "../../components/OverlayPannel/DraggablePanel";
import CameraCard from "../../components/CameraCard";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { chipData } from "../../data/data";
import { activeCam, inActiveCam } from "../../icons/icon";

const Map = () => {
  const [cameraList, setCameraList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Cameras");
  const { data, isLoading, isError, error } = useFetchCameras();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCameraList = sessionStorage.getItem("selectedCameraList");
    if (storedCameraList) {
      setCameraList(JSON.parse(storedCameraList));
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const center = calculateCenter(data);

  const handleMarkerClick = (camera) => {
    if (!cameraList.find((item) => item.cameraId === camera.cameraId)) {
      setCameraList((prevList) => [...prevList, camera]);
      toast.success(`CAM-${camera.cameraId} successfully added`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          marginLeft: "4%",
        },
      });
    } else {
      toast.error(`CAM-${camera.cameraId} Already added`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          marginLeft: "4%",
        },
      });
    }
  };

  const handleRemoveCamera = (cameraId) => {
    setCameraList((prevList) =>
      prevList.filter((camera) => camera.cameraId !== cameraId)
    );
    toast.success(`CAM-${cameraId} successfully removed`, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        marginLeft: "4%",
      },
    });
  };

  const onFooterButtonClick = () => {
    sessionStorage.setItem("selectedCameraList", JSON.stringify(cameraList));
    navigate("/dashboard/map/operations", { state: { cameras: cameraList } });
  };

  const handleChipClick = (label) => {
    setActiveCategory(label);
  };

  const filteredCameras = data.filter((camera) => {
    if (activeCategory === "All Cameras") return true;
    if (activeCategory === "Inactive Cameras")
      return camera.status === "INACTIVE";
    if (activeCategory === "Active Cameras") return camera.status === "ACTIVE";
    if (activeCategory === "Crowd") return camera.cameraType === "Crowd";
    if (activeCategory === "Traffic") return camera.cameraType === "Traffic";
    return false;
  });

  console.log(data);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: 2,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          overflow: "hidden",
          flexWrap: "wrap",
        }}
        justifyContent="center"
      >
        {chipData.map((chip, index) => (
          <Chip
            key={index}
            icon={chip.icon}
            label={chip.label}
            onClick={() => handleChipClick(chip.label)}
            sx={{
              backgroundColor:
                activeCategory === chip.label ? "#B0B0B0" : "white",
              border: `1.5px solid ${activeCategory === chip.label ? "white" : "black"}`,
              color: "black",
              "&:hover": {
                backgroundColor:
                  activeCategory === chip.label ? "#B0B0B0" : "#D3D3D3",
              },
            }}
          />
        ))}
      </Stack>

      {cameraList.length > 0 && (
        <DraggablePanel
          setCameraList={setCameraList}
          onFooterButtonClick={onFooterButtonClick}
          headerTitle="Camera List"
        >
          {cameraList.map((camera) => (
            <CameraCard
              key={camera.cameraId}
              camera={camera}
              onRemove={() => handleRemoveCamera(camera.cameraId)}
            />
          ))}
        </DraggablePanel>
      )}
      <MapView center={center} DEFAULT_ZOOM={16}>
        {filteredCameras.map((camera) => (
          <Marker
            key={camera.cameraId}
            position={camera.coordinates}
            icon={camera.status === "ACTIVE" ? activeCam : inActiveCam}
            eventHandlers={{
              click: () => handleMarkerClick(camera),
            }}
          >
            <Popup>
              <div className="flex flex-col">
                <strong>{camera.cameraName}</strong>
                <span>
                  <b>Camera Id:</b> {camera.cameraId}
                </span>
                <span>
                  <b>Location:</b> {camera.location}
                </span>
                <span>
                  <b>Status:</b> {camera.status}
                </span>
                <span>
                  <b>Installed:</b>{" "}
                  {new Date(camera.installed).toLocaleDateString()}
                </span>
                <span>
                  <b>Last Online:</b>{" "}
                  {new Date(camera.lastOnline).toLocaleDateString()}
                </span>
                <span>
                  <b>Type:</b> {camera.cameraType}
                </span>
                <span>
                  <b>Connection:</b> {camera.connectionType}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapView>
    </div>
  );
};

export default Map;
