import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, IconButton, Button } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import MaximizeIcon from "@mui/icons-material/Maximize";
import MinimizeIcon from "@mui/icons-material/Minimize";

const DraggablePaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: 1000,
  cursor: "move",
  overflow: "hidden",
}));

const ScrollableContent = styled(Box)({
  overflowY: "auto",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",  
  },
  "-ms-overflow-style": "none",
});

const DraggablePanel = ({
  children,
  initialTop = 20,
  initialLeft = 100,
  width = 300,
  minWidth = 300,
  maxWidth = 300,
  initialMaximized = true,
  headerTitle = "Panel",
  footerButtonLabel = "Continue",
  onFooterButtonClick,
  setCameraList,
}) => {
  const [isMaximized, setIsMaximized] = useState(initialMaximized);
  const [position, setPosition] = useState({
    x: parseInt(initialLeft),
    y: parseInt(initialTop),
  });
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const closePanel = () => {
    sessionStorage.removeItem("selectedCameraList");
    setCameraList([]);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".panel-controls")) return;
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - panelRef.current.offsetWidth));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - panelRef.current.offsetHeight));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <DraggablePaper
      ref={panelRef}
      elevation={3}
      style={{
        width: width,
        height: isMaximized ? "80%" : "auto",
        minWidth: `${minWidth}px`,
        maxWidth: isMaximized ? "none" : `${maxWidth}px`,
        top: position.y,
        left: position.x,
      }}
      onMouseDown={handleMouseDown}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="h6">{headerTitle}</Typography>
          <Box className="panel-controls">
            <IconButton size="small" color="inherit" onClick={toggleMaximize}>
              {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
            </IconButton>
            <IconButton size="small" color="inherit" onClick={closePanel}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {isMaximized && (
          <ScrollableContent sx={{ flexGrow: 1, p: 2 }}>
            {children}
          </ScrollableContent>
        )}
        {isMaximized && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Button variant="contained" onClick={onFooterButtonClick} fullWidth>
              {footerButtonLabel}
            </Button>
          </Box>
        )}
      </Box>
    </DraggablePaper>
  );
};

DraggablePanel.propTypes = {
  children: PropTypes.node.isRequired,
  initialTop: PropTypes.string,
  initialLeft: PropTypes.string,
  width: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  initialMaximized: PropTypes.bool,
  headerTitle: PropTypes.string,
  footerButtonLabel: PropTypes.string,
  onFooterButtonClick: PropTypes.func,
  setCameraList: PropTypes.func.isRequired,
};

export default DraggablePanel;