import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  ListItem,
  Box,
  ListItemText,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { operations } from "../data/data";
import RestrictedVehicleForm from "../components/form/RestrictedVehicleForm";
import CrowdRestrictionForm from "../components/form/CrowdRestrictionForm";
import SuspectSearchForm from "../components/form/SuspectSearchForm";
import VehicleSearchForm from "../components/form/VehicleSearchForm";
import CameraCard from "../components/CameraCard";
import toast from "react-hot-toast";
import CameraSelectionModal from "../components/CameraSelectionModal";
import BackButton from "../components/buttons/backbutton"

const CreateOperations = () => {
  const [selectedOperation, setSelectedOperation] = useState("Vehicle Search");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cameraList, setCameraList] = useState([]);

  useEffect(() => {
    const storedCameraList = sessionStorage.getItem("selectedCameraList");
    if (storedCameraList) {
      setCameraList(JSON.parse(storedCameraList));
    }
  }, []);

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
  };

  // const handleFormSubmit = (data) => {
  //   console.log("Form Data: ", data);
  //   console.log(cameraList);
  // };

  const handleAddCameraClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddCameras = (selectedCameras) => {
    // Filter out cameras that are already in the list

    const newCameras = selectedCameras.filter(
      (camera) =>
        !cameraList.some(
          (existingCamera) => existingCamera.cameraId === camera.cameraId,
        ),
    );

    if (newCameras.length === 0) {
      toast.error("All selected cameras are already in the list.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          marginLeft: "4%",
        },
      });
      return;
    }

    const updatedCameraList = [...cameraList, ...newCameras];
    setCameraList(updatedCameraList);
    sessionStorage.setItem(
      "selectedCameraList",
      JSON.stringify(updatedCameraList),
    );
    toast.success("Cameras successfully added!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        marginLeft: "4%",
      },
    });
  };

  const RenderForm = () => {
    switch (selectedOperation) {
      case "Vehicle Search":
        return <VehicleSearchForm cameraList={cameraList} />;
      case "Suspect Search":
        return <SuspectSearchForm cameraList={cameraList} />;
      case "Restricted Vehicle":
        return <RestrictedVehicleForm cameraList={cameraList} />;
      case "Crowd Restriction":
        return <CrowdRestrictionForm cameraList={cameraList} />;
      default:
        return null;
    }
  };

  const handleRemoveCamera = (cameraId) => {
    setCameraList((prevList) =>
      prevList.filter((camera) => camera.cameraId !== cameraId),
    );
    sessionStorage.setItem(
      "selectedCameraList",
      JSON.stringify(
        cameraList.filter((camera) => camera.cameraId !== cameraId),
      ),
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

  return (
    <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
      {/* Left Column - Operations List */}
     
      <Grid
        item
        xs={2}
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Paper sx={{ height: "100%" }}>
        
          <Typography
            sx={{
              padding: 1.5,
              display: "flex",
              flexDirection: "row",
              backgroundColor: "rgb(0,0,0,0.4)",
              color: "#fff",
              textAlign: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <BackButton/>
            Operations
          </Typography>
          <Divider />
          {operations.map((operation, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleOperationSelect(operation.name)}
                selected={selectedOperation === operation.name}
                sx={{ py: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>{operation.icon}</Box>
                  <ListItemText secondary={operation.name} />
                </Box>
              </ListItem>
              {index < operations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      </Grid>

      {/* Middle Column - Form */}
      <Grid
        item
        xs={7}
        sx={{
          overflowY: "auto",
          borderLeft: "1px solid rgba(128, 128, 128, 0.1)",
          borderRight: "1px solid rgba(128, 128, 128, 0.1)",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Paper sx={{ height: "100%" }}>
          <Typography
            sx={{
              padding: 1.5,
              backgroundColor: "rgb(0,0,0,0.4)",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {selectedOperation || "Select an Operation"}
          </Typography>
          <Divider />
          {selectedOperation && (
            <Box>
              <RenderForm />
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Right Column - Camera List */}
      <Grid
        item
        xs={3}
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Paper
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography
              sx={{
                padding: 1.5,
                backgroundColor: "rgb(0,0,0,0.4)",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Cameras
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
          </Box>
          <Box sx={{ px: 2, flex: 1 }}>
            {cameraList.length > 0 ? (
              cameraList.map((camera) => (
                <CameraCard
                  key={camera.cameraId}
                  camera={camera}
                  onRemove={() => handleRemoveCamera(camera.cameraId)}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ textAlign: "center", flex: 1 }}>
                  No cameras selected!
                </Typography>
              </Box>
            )}
          </Box>
          <Box>
            <Divider sx={{ marginBottom: 2 }} />
            <Box sx={{ padding: 1, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddCameraClick}
                sx={{ alignSelf: "center", marginBottom: 2, color: "white" }}
              >
                Add Camera
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <CameraSelectionModal
        cameraList={cameraList}
        open={isModalOpen}
        handleClose={handleModalClose}
        onAddCameras={handleAddCameras}
      />
    </Grid>
  );
};

export default CreateOperations;
