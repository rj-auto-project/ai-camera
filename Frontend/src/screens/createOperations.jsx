import React, { useState } from "react";
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
const CreateOperations = () => {
  const [selectedOperation, setSelectedOperation] = useState("Vehicle Search");

  const [cameraList, setCameraList] = useState([]);

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
  };

  const handleFormSubmit = (data) => {
    console.log("Form Data: ", data);
  };

  const RenderForm = () => {
    switch (selectedOperation) {
      case "Vehicle Search":
        return <VehicleSearchForm onSubmit={handleFormSubmit} />;
      case "Suspect Search":
        return <SuspectSearchForm onSubmit={handleFormSubmit} />;
      case "Restricted Vehicle":
        return <RestrictedVehicleForm onSubmit={handleFormSubmit} />;
      case "Crowd Restriction":
        return <CrowdRestrictionForm onSubmit={handleFormSubmit} />;
      default:
        return null;
    }
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
              backgroundColor: "rgb(0,0,0,0.4)",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
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
            <Box sx={{ px: 2 }}>
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
            justifyContent: "space-between",
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

          {cameraList.length > 0 ? (
            cameraList.map((camera, index) => (
              <Box sx={{ padding: 1 }} key={index}>
                <Box
                  sx={{
                    marginBottom: 2,
                    padding: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                  }}
                >
                  <Typography sx={{ padding: 1 }}>
                    {camera.name || `Camera ${index + 1}`}
                  </Typography>
                </Box>
                {index < cameraList.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Typography sx={{ textAlign: "center", flex: 1 }}>
                No cameras selected!
              </Typography>
            </Box>
          )}
          <Box>
            <Divider sx={{ marginBottom: 2 }} />
            <Box sx={{ padding: 1, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ color: "#fff" }}
                startIcon={<AddIcon />}
              >
                Add Camera
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateOperations;
