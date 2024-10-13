import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { settingsOptions } from "../data/data";
import CameraSettings from "../components/settings/CameraSettings";

const Setting = () => {
  const [selectedOptions, setSelectedOptions] = useState("User");
  const [openModal, setOpenModal] = useState(null);

  const openAnnotationModal = (type) => {
    setOpenModal(type);
  };

  const closeAnnotationModal = () => {
    setOpenModal(null);
  };

  const handleOperationSelect = (option) => {
    setSelectedOptions(option);
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
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Settings
          </Typography>
          <Divider />
          {settingsOptions.map((option, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleOperationSelect(option.name)}
                selected={selectedOptions === option.name}
                sx={{
                  py: 1.5,
                  backgroundColor:
                    selectedOptions === option.name
                      ? "rgba(0, 123, 255, 0.1)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ marginRight: 2 }}>{option.icon}</Box>
                  <ListItemText
                    secondary={
                      <Typography
                        variant="body1"
                        sx={{
                          color:
                            selectedOptions === option.name
                              ? "primary.main"
                              : "inherit",
                        }}
                        fontWeight={"400"}
                      >
                        {option.name}
                      </Typography>
                    }
                  />
                </Box>
              </ListItem>
              {index < settingsOptions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      </Grid>

      {/* Middle Column - Settings Form */}
      <Grid
        item
        xs={7}
        sx={{
          height: "100vh",
          overflow: "hidden",
          borderLeft: "1px solid rgba(128, 128, 128, 0.1)",
          borderRight: "1px solid rgba(128, 128, 128, 0.1)",
        }}
      >
        <Paper
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Typography
            sx={{
              padding: 1.5,
              backgroundColor: "rgb(0,0,0,0.4)",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {`${selectedOptions} settings` || "Select an Operation"}
          </Typography>
          <Divider />
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 2,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {selectedOptions === "Camera" && (
              <CameraSettings
                openModal={openModal}
                closeModal={closeAnnotationModal}
                openAnnotationModal={openAnnotationModal}
              />
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Right Column - Additional Actions */}
      <Grid item xs={3} sx={{ overflowY: "auto" }}>
        <Paper sx={{ height: "100%" }}>
          <Typography
            sx={{
              padding: 1.5,
              display: "flex",
              flexDirection: "row",
              backgroundColor: "rgb(0,0,0,0.4)",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Additional Actions
          </Typography>
          <Divider />
          {/* Your additional actions for each setting */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Setting;
