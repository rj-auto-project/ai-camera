import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { formatTimeToIST } from "../../utils/formatTime.js";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import WifiIcon from "@mui/icons-material/Wifi";
import LanIcon from "@mui/icons-material/Lan";
import CircleIcon from "@mui/icons-material/Circle";

const CameraDetailsModal = ({ open, onClose, cameras }) => {
  const getStatusChip = (status) => (
    <Chip
      label={status}
      size="small"
      icon={<CircleIcon style={{ color: "red", font: "menu" }} />}
      color={status === "ACTIVE" ? "success" : "error"}
      sx={{ color: "red", fontWeight: "bold" }}
    />
  );

  const getConnectionIcon = (connectionType) =>
    connectionType === "Wireless" ? (
      <WifiIcon fontSize="small" />
    ) : (
      <LanIcon fontSize="small" />
    );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Camera Details</DialogTitle>
      <DialogContent
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px", // Width of the scrollbar
            height: "6px", // Height of the horizontal scrollbar
            backgroundColor: "transparent", // Transparent background for both scrollbars
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#333", // Color of the draggable part of the scrollbar
            borderRadius: "10px", // Roundness of the scrollbar thumb
            border: "1px solid #f9f9f9", // Adds padding around the scrollbar thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#222", // Color when hovering over the scrollbar thumb
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent", // Transparent track for both scrollbars
            borderRadius: "10px", // Roundness of the scrollbar track
          },
          "&::-webkit-scrollbar-track-piece": {
            backgroundColor: "transparent", // The part of the track not covered by the thumb
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent", // The corner where the two scrollbars meet
          },
          "&::-webkit-resizer": {
            backgroundColor: "transparent", // The draggable resizer corner in some elements
          },
        }}
      >
        <List>
          {cameras.map((camera) => (
            <React.Fragment key={camera?.cameraId}>
              <Card variant="outlined" sx={{ marginBottom: 2 }}>
                <CardContent>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6">{`${camera?.cameraId}. ${camera?.cameraName}`}</Typography>
                          {getStatusChip(camera?.status)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Location: {camera?.location}
                          </Typography>
                          <Tooltip title="Camera IP Address" arrow>
                            <Typography variant="body2" color="textSecondary">
                              IP Address: {camera?.cameraIp}
                            </Typography>
                          </Tooltip>
                          <Typography variant="body2" color="textSecondary">
                            Facing Angle: {camera?.facingAngle}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={1}
                          >
                            <CameraAltIcon fontSize="small" />
                            <Typography variant="body2">
                              {camera?.cameraType}
                            </Typography>
                            {getConnectionIcon(camera?.connectionType)}
                            <Typography variant="body2">
                              {camera?.connectionType}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Last Online: {formatTimeToIST(camera?.lastOnline)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </CardContent>
              </Card>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CameraDetailsModal;
