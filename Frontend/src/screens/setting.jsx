import {
  Box,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Modal,
  InputLabel,
} from "@mui/material";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { settingsOptions } from "../data/data";
import { FaStackOverflow } from "react-icons/fa";
import CanvasDraw from "../components/canvasdraw/canvasDraw"

const Setting = () => {
  const [selectedOptions, setSelectedOptions] = useState("User");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [openModal, setOpenModal] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
    // Handle form data
  };

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
                  py: 2,
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
                    secondary={option.name}
                    sx={{
                      color:
                        selectedOptions === option.name
                          ? "primary.main"
                          : "inherit",
                    }}
                  />
                </Box>
              </ListItem>
              {index < settingsOptions.length - 1 && <Divider />}
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
            {`${selectedOptions} settings` || "Select an Operation"}
          </Typography>
          <Divider/>
          <Box
      sx={{
        flex: 1, // To make the form container grow and allow scrolling
        overflowY: "auto", // Enable scrolling for this container
        padding: 2, // Optional padding inside the container
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
          {selectedOptions === "Camera" && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} p={5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Camera IP"
                    {...register("cameraIp", {
                      required: "Camera IP is required",
                    })}
                    error={!!errors.cameraIp}
                    helperText={errors.cameraIp?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Camera Name"
                    {...register("cameraName", {
                      required: "Camera name is required",
                    })}
                    error={!!errors.cameraName}
                    helperText={errors.cameraName?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    {...register("cameraCoordinates.lat", {
                      required: "Latitude is required",
                    })}
                    error={!!errors.cameraCoordinates?.lat}
                    helperText={errors.cameraCoordinates?.lat?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    {...register("cameraCoordinates.long", {
                      required: "Longitude is required",
                    })}
                    error={!!errors.cameraCoordinates?.long}
                    helperText={errors.cameraCoordinates?.long?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Camera Location"
                    {...register("cameraLocation", {
                      required: "Camera location is required",
                    })}
                    error={!!errors.cameraLocation}
                    helperText={errors.cameraLocation?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Camera Type</InputLabel>
                    <Controller
                      name="cameraType"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select {...field}>
                          <MenuItem value="wired">Wired</MenuItem>
                          <MenuItem value="wireless">Wireless</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Specialization Tag</InputLabel>
                    <Controller
                      name="specializationTag"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <MenuItem value="ANPR">ANPR</MenuItem>
                          <MenuItem value="illegalParking">
                            Illegal Parking
                          </MenuItem>
                          <MenuItem value="vehicleCount">
                            Vehicle Count
                          </MenuItem>
                          {/* Add other options here */}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Count Threshold"
                    type="number"
                    {...register("vehicleCountThreshold", {
                      required: "Threshold is required",
                    })}
                    error={!!errors.vehicleCountThreshold}
                    helperText={errors.vehicleCountThreshold?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Crowd Count Threshold"
                    type="number"
                    {...register("crowdCountThreshold", {
                      required: "Threshold is required",
                    })}
                    error={!!errors.crowdCountThreshold}
                    helperText={errors.crowdCountThreshold?.message}
                  />
                </Grid>
                <Grid item>
                  <Typography>Set Coordinates for:</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container sx={{ justifyContent: "space-between",pb:2}}>
                    <Button
                      variant="outlined"
                      onClick={() => openAnnotationModal("illegalParking")}
                    >
                      Illegal Parking
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => openAnnotationModal("redLightCrossing")}
                    >
                      Red Light Crossing
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => openAnnotationModal("wrongWay")}
                    >
                      Wrong Way
                    </Button>
                  </Grid>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center", 
                    alignItems: "center", 
                  }}>
                  
                    <Button type="submit" variant="outline" color="primary">
                      Add Camera
                    </Button>

                </Grid>
              </Grid>

              {/* Modal for setting coordinates */}
              <Modal open={!!openModal} onClose={closeAnnotationModal}>
                <Box sx={{ ...modalStyle }}>
                  <h2>Set Coordinates for {openModal}</h2>
                   <CanvasDraw/>
                  {/* Coordinate selection logic goes here */}
                  <Button onClick={closeAnnotationModal}>Close</Button>
                </Box>
              </Modal>
            </form>
          )}
          </Box>
        </Paper>
      </Grid>

      {/* Right Column - Additional Information */}
      <Grid item xs={3} sx={{ overflowY: "auto", scrollbarWidth: "none" }}>
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
            Additional Information
          </Typography>
          <Divider />
          {/* Add content here as needed */}
        </Paper>
      </Grid>
    </Grid>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 600,
  borderRadius: 1,
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default Setting;
