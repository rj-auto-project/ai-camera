import React from "react";
import { Typography, Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const ImageModel = ({
  selectedItem,
  setSelectedItem,
  isOpen,
  setOpen,
  index,
  incident = "",
}) => {
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };


  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.href = `http://localhost:6543/${selectedItem?.incidentType}/${selectedItem?.thumbnail}`;
    link.download =
      `${selectedItem.licenseNumber}-${new Date().toLocaleString()}` ||
      `${selectedItem.license_number}-${new Date().toLocaleString()}` ||
      `thumbnail-${new Date().toLocaleString()}` ||
      "image";
    link.click();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#0e2433",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          alignItems: "center",
          width: "80%",
          maxWidth: "800px",
          maxHeight: "90vh",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={handleSaveImage} color="inherit">
            <SaveIcon style={{ color: "white" }} />
          </IconButton>
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon style={{ color: "white" }} />
          </IconButton>
        </Box>
        <img
          src={`http://localhost:6543/${selectedItem?.incidentType}/${selectedItem?.thumbnail}`}
          alt={
            selectedItem.licenseNumber ||
            selectedItem?.license_number ||
            "No License Number"
          }
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "80%",
            objectFit: "cover",
          }}
        />
        <Box
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            textAlign: "center",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">
            Timestamp: <br />
            {new Date(
              selectedItem.timestamp || selectedItem?.time_stamp
            ).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Camera IP: <br />
            {selectedItem.camera_ip}
          </Typography>
          <Typography variant="body2">
            Class: <br />
            {selectedItem.detectionClass}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageModel;
