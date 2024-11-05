import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Chip, Stack } from "@mui/material";
import toast from "react-hot-toast";
import MapView from "./mapview";
import { useFetchCameras } from "../../api/hooks/useFetchCameras";
import { calculateCenter } from "../../utils/calculateCenter";
import DraggablePanel from "../../components/OverlayPannel/DraggablePanel";
import CameraCard from "../../components/card/CameraCard";
import { chipData } from "../../data/data";
import { activeCam, compass, inActiveCam } from "../../icons/icon";
import useFetchHeatmap from "../../api/hooks/live/useFetchHeatmap";
import CenterButton from "../../components/buttons/CenterButton";
import AnimatedMapView from "../../components/AnimatedMapView";

const Map = () => {
  const [cameraList, setCameraList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Cameras");
  const { eventData } = useFetchHeatmap(activeCategory);
  const navigate = useNavigate();

  const { isError } = useFetchCameras();
  const { data, isLoading, error } = useSelector((state) => state.mapcamera);

  useEffect(() => {
    const storedCameraList = sessionStorage.getItem("selectedCameraList");
    if (storedCameraList) {
      setCameraList(JSON.parse(storedCameraList));
    }
  }, []);

  const handleMarkerClick = useCallback(
    (camera) => {
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
    },
    [cameraList]
  );

  const handleRemoveCamera = useCallback((cameraId) => {
    setCameraList((prevList) =>
      prevList.filter((camera) => camera.cameraId !== cameraId)
    );
    sessionStorage.removeItem("selectedCameraList");
    toast.success(`CAM-${cameraId} successfully removed`, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        marginLeft: "4%",
      },
    });
  }, []);

  const onFooterButtonClick = useCallback(() => {
    sessionStorage.setItem("selectedCameraList", JSON.stringify(cameraList));
    navigate("/dashboard/map/create-operations", {
      state: { cameras: cameraList },
    });
  }, [cameraList, navigate]);

  const handleChipClick = useCallback((label) => {
    setActiveCategory(label);
  }, []);

  const filteredCameras = useMemo(() => {
    return data.filter((camera) => {
      if (activeCategory === "All Cameras") return true;
      if (activeCategory === "Inactive Cameras")
        return camera.status === "INACTIVE";
      if (activeCategory === "Active Cameras")
        return camera.status === "ACTIVE";
      if (activeCategory === "Crowd") return camera.cameraType === "Crowd";
      if (activeCategory === "Traffic") return camera.cameraType === "Traffic";
      return false;
    });
  }, [data, activeCategory]);

  const coordinates = useMemo(() => {
    return activeCategory === "Crowd" || activeCategory === "Traffic"
      ? eventData
      : filteredCameras?.map((camera) => camera?.coordinates);
  }, [activeCategory, eventData, filteredCameras]);

  const center = useMemo(() => {
    if (coordinates?.length === 1) return coordinates[0];
    else return calculateCenter(coordinates);
  }, [coordinates]) || [26.9124, 75.7873];

  console.log("Center", coordinates[0]);

  if (isLoading || !data.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (isError) {
    return <Box>Error: {error.message}</Box>;
  }
  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
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
            label={
              <Typography
                variant="body1"
                sx={{ fontWeight: "500", fontSize: 13 }}
              >
                {chip.label}
              </Typography>
            }
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
      <MapView
        center={[0, 0]}
        zoom={3}
        activeCategory={activeCategory}
        heatmapData={eventData}
      >
        <AnimatedMapView data={data} center={center} zoom={13}>
          <CenterButton center={center} />
          <Marker position={center} icon={compass}/>
          {filteredCameras.map((camera) => (
            <Marker
              key={camera.cameraId}
              position={camera.coordinates}
              icon={camera.status === "ACTIVE" ? activeCam : inActiveCam}
              eventHandlers={{
                click: (e) => {
                  e.target._map.setView(
                    e.target.getLatLng(),
                    e.target._map.getZoom()
                  );
                  handleMarkerClick(camera);
                },
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
        </AnimatedMapView>
      </MapView>
    </Box>
  );
};

export default Map;
