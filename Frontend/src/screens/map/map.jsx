import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import MapView from "./MapView";
import { useFetchCameras } from "../../api/api";
import { calculateCenter } from "../../utils/calculateCenter";
import DraggablePanel from "../../components/OverlayPannel/DraggablePanel";
import CameraCard from "../../components/CameraCard";
import toast, { Toaster } from "react-hot-toast";

const Map = () => {
  const [cameraList, setCameraList] = useState([]);
  const { data, isLoading, isError, error } = useFetchCameras();

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
      toast.success(`CAM-${camera.cameraId} successfully added`,{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          marginLeft:"4%"
        },
      });
    }
    else{
      toast.error(`CAM-${camera.cameraId} Already added`,{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          marginLeft:"4%"
        }});
    }
   
  };

  console.log(data);

  const handleRemoveCamera = (cameraId) => {
    setCameraList((prevList) =>
      prevList.filter((camera) => camera.cameraId !== cameraId)
    )
    
    toast.success(`CAM-${cameraId} successfully removed`,{
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        marginLeft:"4%"
      }});
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {cameraList.length > 0 && (
        <DraggablePanel headerTitle="Camera List">
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
        {data &&
          data.map((camera) => (
            <Marker
              key={camera.cameraId}
              position={camera.coordinates}
              eventHandlers={{
                click: () => handleMarkerClick(camera),
              }}
            >
              <Popup>
                <strong>{camera.cameraName}</strong>
                <br />
                <b>Camera Id:</b> {camera.cameraId}
                <br />
                <b>Location:</b> {camera.location}
                <br />
                <b>Status:</b> {camera.status}
                <br />
                <b>Installed:</b>{" "}
                {new Date(camera.installed).toLocaleDateString()}
                <br />
                <b>Last Online:</b>{" "}
                {new Date(camera.lastOnline).toLocaleDateString()}
                <br />
                <b>Type:</b> {camera.cameraType}
                <br />
                <b>Connection:</b> {camera.connectionType}
              </Popup>
            </Marker>
          ))}
      </MapView>
      <Toaster position="bottom-left" reverseOrder={false} />
    </div>
  );
};

export default Map;
