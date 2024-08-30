import React, { useState, useMemo } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import Select from "react-select";
import { useFetchCameras } from "../api/hooks/useFetchCameras";

const CameraSelectionModal = ({
  open,
  handleClose,
  onAddCameras,
  cameraList,
}) => {
  const { data: cameras, isLoading, isError, error } = useFetchCameras();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState([]);

  // Get unique locations from cameras
  const locations = useMemo(() => {
    if (!cameras) return [];
    return Array.from(new Set(cameras.map((camera) => camera.location))).map(
      (location) => ({
        value: location,
        label: location,
      })
    );
  }, [cameras]);

  // Filter cameras based on selected locations
  const filteredCameras = useMemo(() => {
    if (selectedLocations.length === 0 || !cameras) return [];
    return cameras.filter((camera) =>
      selectedLocations.some((location) => camera.location === location.value)
    );
  }, [selectedLocations, cameras]);

  const handleLocationChange = (selectedOptions) => {
    setSelectedLocations(selectedOptions || []);
  };

  const handleCameraSelect = (camera) => {
    setSelectedCameras((prev) =>
      prev.includes(camera)
        ? prev.filter((c) => c.cameraId !== camera.cameraId)
        : [...prev, camera, ...cameraList]
    );
  };

  const handleAddCameras = () => {
    onAddCameras(selectedCameras);
    handleClose();
    setSelectedLocations([]);
  };



  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1d1c1c",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          // Ensure the box has enough space to show scrollable content
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Cameras
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography color="error">Error: {error.message}</Typography>
        ) : (
          <>
            <Select
              isMulti
              placeholder="Select Locations"
              options={locations}
              onChange={handleLocationChange}
              value={selectedLocations}
              isSearchable
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#f0f0f0", // Background color for dropdown
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: 200, // Adjust max height for dropdown
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#c0c0c0" : "white",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }),
              }}
            />
            <Divider sx={{ my: 2 }} />
            {filteredCameras.length > 0 && (
              <List
                sx={{
                  mt: 2,
                  maxHeight: 200,
                  overflowY: "scroll", // Allow vertical scrolling
                  "&::-webkit-scrollbar": {
                    width: "0px", // Hide scrollbar for WebKit-based browsers
                    background: "transparent", // Optional: make scrollbar track transparent
                  },
                  scrollbarWidth: "none", // Hide scrollbar for Firefox
                }}
              >
                {filteredCameras.map((camera) => (
                  <ListItem
                    key={camera.cameraId}
                    button
                    onClick={() => handleCameraSelect(camera)}
                  >
                    <Checkbox
                      checked={selectedCameras.some(
                        (c) => c.cameraId === camera.cameraId
                      )}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText
                      primary={camera.cameraName}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Camera ID: {camera.cameraId}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Location: {camera.location}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            sx={{ mr: 2 }}
            onClick={handleAddCameras}
            disabled={selectedCameras.length === 0}
          >
            Add Cameras
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CameraSelectionModal;
