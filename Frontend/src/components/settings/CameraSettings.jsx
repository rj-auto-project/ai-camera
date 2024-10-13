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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CanvasDraw from "../canvasdraw/canvasDraw";
import { Close } from "@mui/icons-material";
import { useAddCamera } from "../../api/hooks/useCamera";
import toast from "react-hot-toast";

const CameraSettings = ({ openModal, closeModal, openAnnotationModal }) => {
  const [imageCoordinates, setImageCordinates] = useState([]);
  let { mutate, isLoading, error } = useAddCamera();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const cameraCoordinates = [
      parseFloat(data.cameraLat),
      parseFloat(data.cameraLong),
    ];
    const newData = { ...data, cameraCoordinates, imageCoordinates };

    try {
      await mutate(newData);
      toast.success("Camera added successfully!");
    } catch (err) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while adding the camera."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Camera Id"
            {...register("cameraId", {
              required: "Camera Id name is required",
            })}
            error={false} // Keep this as false to avoid red border
            helperText={
              errors.cameraId ? (
                <span style={{ color: "red" }}>{errors.cameraId.message}</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Camera IP"
            {...register("cameraIp", {
              required: "Camera IP is required",
            })}
            error={false}
            helperText={
              errors.cameraIp ? (
                <span style={{ color: "red" }}>{errors.cameraIp.message}</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Camera Name"
            {...register("cameraName", {
              required: "Camera name is required",
            })}
            error={false}
            helperText={
              errors.cameraName ? (
                <span style={{ color: "red" }}>
                  {errors.cameraName.message}
                </span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Manufacturer"
            {...register("manufacturer", {
              required: "Manufacturer name is required",
            })}
            error={false}
            helperText={
              errors.manufacturer ? (
                <span style={{ color: "red" }}>
                  {errors.manufacturer.message}
                </span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Latitude"
            type="text"
            {...register("cameraLat", {
              required: "Latitude is required",
              pattern: {
                value: /^-?\d+(\.\d+)?$/,
                message: "Latitude must be a valid number",
              },
            })}
            error={false}
            helperText={
              errors.cameraLat ? (
                <span style={{ color: "red" }}>{errors.cameraLat.message}</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Longitude"
            type="text"
            {...register("cameraLong", {
              required: "Longitude is required",
              pattern: {
                value: /^-?\d+(\.\d+)?$/,
                message: "Longitude must be a valid number",
              },
            })}
            error={false}
            helperText={
              errors.cameraLong ? (
                <span style={{ color: "red" }}>
                  {errors.cameraLong.message}
                </span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Camera Location"
            {...register("cameraLocation", {
              required: "Camera location is required",
            })}
            error={false}
            helperText={
              errors.cameraLocation ? (
                <span style={{ color: "red" }}>
                  {errors.cameraLocation.message}
                </span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Camera Type</InputLabel>
            <Controller
              name="cameraType"
              control={control}
              defaultValue=""
              rules={{ required: "Camera Type is required" }}
              render={({ field }) => (
                <Select {...field} error={false}>
                  <MenuItem value="">Select Camera Type</MenuItem>
                  <MenuItem value="dome">Dome</MenuItem>
                  <MenuItem value="bullet">Bullet</MenuItem>
                </Select>
              )}
            />
            {errors.cameraType && (
              <FormHelperText style={{ color: "red" }}>
                {errors.cameraType.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Connection Type</InputLabel>
            <Controller
              name="connectionType"
              control={control}
              defaultValue=""
              rules={{ required: "Connection Type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={false}
                >
                  <MenuItem value="">Select Connection Type</MenuItem>
                  <MenuItem value="wired">Wired</MenuItem>
                  <MenuItem value="wireless">Wireless</MenuItem>
                </Select>
              )}
            />
            {errors.connectionType && (
              <FormHelperText style={{ color: "red" }}>
                {errors.connectionType.message}
              </FormHelperText>
            )}
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
            error={false}
            helperText={
              errors.vehicleCountThreshold ? (
                <span style={{ color: "red" }}>
                  {errors.vehicleCountThreshold.message}
                </span>
              ) : (
                ""
              )
            }
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
            error={false}
            helperText={
              errors.crowdCountThreshold ? (
                <span style={{ color: "red" }}>
                  {errors.crowdCountThreshold.message}
                </span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Facing Angle"
            type="text"
            {...register("facingAngle", {
              required: "Facing angle is required",
              pattern: {
                value: /^-?\d+(\.\d+)?$/,
                message: "Facing angle must be a valid number",
              },
            })}
            error={false}
            helperText={
              errors.facingAngle ? (
                <span style={{ color: "red" }}>
                  {errors.facingAngle.message}
                </span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Area Name"
            {...register("areaName", {
              required: "Area is required",
            })}
            error={false}
            helperText={
              errors.areaName ? (
                <span style={{ color: "red" }}>{errors.areaName.message}</span>
              ) : (
                ""
              )
            }
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "16px", color: "white" }}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Adding..." : "Add Camera"}
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
