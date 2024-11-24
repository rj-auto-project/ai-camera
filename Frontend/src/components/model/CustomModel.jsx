import React, { useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { Minimize2, Maximize2, X } from "lucide-react";
const CustomModel = ({ isOpen, onClose, children, title = "" }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const modalStyle = {
    position: "fixed",
    top: isMaximized ? 0 : "50%",
    left: isMaximized ? 0 : "50%",
    transform: isMaximized ? "none" : "translate(-50%, -50%)",
    width: isMaximized ? "100vw" : "80vw",
    height: isMaximized ? "100vh" : "80vh",
    backgroundColor: "background.paper",
    zIndex: 1300,
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Box component={Paper} elevation={24} sx={modalStyle}>
        {/* Title bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            py: 1,
            cursor: "move",
          }}
        >
          <Typography variant="subtitle1" component="div">
            {title}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={() => setIsMaximized(!isMaximized)}
              sx={{ mr: 1 }}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </Box>
        </Box>
        {children}
      </Box>

      {/* Backdrop */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1200,
        }}
        onClick={onClose}
      />
    </>
  );
};

export default CustomModel;
