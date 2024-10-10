import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Modal,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CanvasDraw from "../canvasdraw/canvasDraw";
import { Close } from "@mui/icons-material";

const CameraSettings = ({ openModal, closeModal, openAnnotationModal }) => {
  const [imageCoordinates, setImageCordinates] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const newdata = { imageCoordinates: imageCoordinates, ...data };
    console.log(newdata);
    // Handle form data
  };

  return (
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
                  <MenuItem value="dome">Dome</MenuItem>
                  <MenuItem value="bullet">Bullet</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Connection Type</InputLabel>
            <Controller
              name="ConnectionType"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="wired">Wired</MenuItem>
                  <MenuItem value="wireless">Wireless</MenuItem>
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
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Facing Angle"
            type="number"
            {...register("facingAngle", {
              required: "Facing angle is required",
            })}
            error={!!errors.facingAngle}
            helperText={errors.facingAngle?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Area Name"
            {...register("areaName", {
              required: "Area is required",
            })}
            error={!!errors.areaName}
            helperText={errors.areaName?.message}
          />
        </Grid>
        <Grid item>
          <Typography>Set Coordinates for:</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{ justifyContent: "space-between", pb: 2 }}>
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

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button type="submit" variant="outlined" color="primary">
            Add Camera
          </Button>
        </Grid>
      </Grid>

      <Modal open={!!openModal} onClose={closeModal}>
        <Box sx={{ ...modalStyle }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography ml={2} mt={1}>
              Set Coordinates for {openModal}
            </Typography>
            <IconButton
              onClick={closeModal}
              size="small"
              sx={{ width: 30, height: 30, backgroundColor: "red", margin: 1 }}
            >
              <Close />
            </IconButton>
          </Box>
          <CanvasDraw
            modelType={openModal}
            closeModal={closeModal}
            setImageCordinates={setImageCordinates}
          />
        </Box>
      </Modal>
    </form>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: 1,
  transform: "translate(-50%, -50%)",
  backgroundColor: "#1d1c1c",
  boxShadow: 24,
};

export default CameraSettings;
