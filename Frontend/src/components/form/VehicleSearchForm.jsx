import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextFieldInput from "../Input/TextFieldInput";
import SelectFieldInput from "../Input/SelectFieldInput";
import {
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import useVehicleSearch from "../../api/hooks/useVehicleSearch";
import { formatDateTime } from "../../utils/formatTime";
import VehicleSearchTable from "../table/VehicleSearchTable";

const VehicleSearchForm = ({ cameraList }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [camIds, setCamIds] = useState([]);
  const [formType, setFormType] = useState("");
  const [licenseOption, setLicenseOption] = useState(false);

  useEffect(() => {
    if (cameraList && cameraList.length > 0) {
      const ids = cameraList.map((camera) => camera.cameraId);
      setCamIds(ids);
    }
  }, [cameraList]);

  const {
    mutate,
    eventData,
    data,
    isLoading,
    isError,
    error,
    closeEventSource,
  } = useVehicleSearch({ formType });

  const onSubmit = (formData) => {
    console.log("Form data: ", formData);
    console.log("submiting", isLoading);
    const formattedStartTime = formatDateTime(formData.startTime);
    const formattedEndTime = formatDateTime(formData.endTime);

    let data;

    if (licenseOption) {
      data = {
        cameras: camIds,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        licensePlate: formData.licenseNumber,
      };
    } else {
      data = {
        cameras: camIds,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        classes: [formData.vehicleClass],
        ownerName: formData.ownerName,
        topColor: formData.topColor,
        bottomColor: formData.bottomColor,
      };
    }

    console.log("Formatted data: ", data);

    mutate(data);

    reset();
  };

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
  };

  const handleLicenseOptionChange = (event) => {
    setLicenseOption(event.target.checked);
  };

  const vehicleClasses = [
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "truck", label: "Truck" },
    { value: "car", label: "Car" },
    { value: "auto", label: "Auto" },
    { value: "Hatchback", label: "Hatchback" },
    { value: "motorbike-rider", label: "Motorbike Rider" },
    { value: "scooty-rider", label: "Scooty Rider" },
    { value: "scorpio", label: "Scorpio" },
    { value: "bolero", label: "Bolero" },
    { value: "apache", label: "Apache" },
    { value: "bullet", label: "Bullet" },
    { value: "bus", label: "Bus" },
    { value: "motorbike", label: "Motorbike" },
    { value: "omni", label: "Omni" },
    { value: "pickup", label: "Pickup" },
    { value: "pulsar", label: "Pulsar" },
    { value: "scooty", label: "Scooty" },
    { value: "swift", label: "Swift" },
    { value: "thar", label: "Thar" },
    { value: "tractor", label: "Tractor" },
    { value: "van", label: "Van" },
  ];

  return data ? (
    <VehicleSearchTable data={data} />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
      <FormControl fullWidth style={{ marginBottom: "16px" }}>
        <FormLabel>Select Form Type</FormLabel>
        <Select value={formType} onChange={handleFormTypeChange} displayEmpty>
          <MenuItem value="anpr">ANPR</MenuItem>
          <MenuItem value="vehicle">Vehicle Search</MenuItem>
        </Select>
      </FormControl>

      {formType === "anpr" && (
        <>
          <FormControl component="fieldset" style={{ marginBottom: "16px" }}>
            <FormLabel component="legend">Select Information Type</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={licenseOption}
                  onChange={handleLicenseOptionChange}
                />
              }
              label="License Number Only"
            />
          </FormControl>

          {licenseOption ? (
            <TextFieldInput
              name="licenseNumber"
              label="License Number"
              type="text"
              control={control}
              rules={{ required: "License Number is required" }}
              error={errors.licenseNumber}
              helperText={errors.licenseNumber?.message}
            />
          ) : (
            <>
              <TextFieldInput
                name="ownerName"
                label="Owner Name"
                type="text"
                control={control}
                rules={{ required: "Owner Name is required" }}
                error={errors.ownerName}
                helperText={errors.ownerName?.message}
              />
              <SelectFieldInput
                name="vehicleClass"
                label="Vehicle Class"
                options={vehicleClasses}
                control={control}
                rules={{ required: "Vehicle Class is required" }}
                error={errors.vehicleClass}
                helperText={errors.vehicleClass?.message}
              />
            </>
          )}
        </>
      )}

      {formType === "vehicle" && (
        <>
          <SelectFieldInput
            name="vehicleClass"
            label="Vehicle Class"
            options={vehicleClasses}
            control={control}
            rules={{ required: "Vehicle Class is required" }}
            error={errors.vehicleClass}
            helperText={errors.vehicleClass?.message}
          />
          <SelectFieldInput
            name="topColor"
            label="Color 1"
            options={[
              { value: "red", label: "Red" },
              { value: "blue", label: "Blue" },
              { value: "green", label: "Green" },
              { value: "black", label: "Black" },
              { value: "white", label: "White" },
              { value: "yellow", label: "Yellow" },
              { value: "orange", label: "Orange" },
              { value: "brown", label: "Brown" },
            ]}
            control={control}
            rules={{ required: "Top Color is required" }}
            error={errors.topColor}
            helperText={errors.topColor?.message}
          />
          <SelectFieldInput
            name="bottomColor"
            label="Color 2"
            options={[
              { value: "red", label: "Red" },
              { value: "blue", label: "Blue" },
              { value: "green", label: "Green" },
              { value: "black", label: "Black" },
              { value: "white", label: "White" },
              { value: "yellow", label: "Yellow" },
              { value: "orange", label: "Orange" },
              { value: "brown", label: "Brown" },
            ]}
            control={control}
            rules={{ required: "Bottom Color is required" }}
            error={errors.bottomColor}
            helperText={errors.bottomColor?.message}
          />
        </>
      )}

      <TextFieldInput
        name="startTime"
        label="Start Time"
        type="datetime-local"
        control={control}
        rules={{ required: "Start Time is required" }}
        error={errors.startTime}
        helperText={errors.startTime?.message}
      />

      <TextFieldInput
        name="endTime"
        label="End Time"
        type="datetime-local"
        control={control}
        rules={{ required: "End Time is required" }}
        error={errors.endTime}
        helperText={errors.endTime?.message}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: "16px", color: "white" }}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {isLoading ? "creating..." : "Create"}
      </Button>
    </form>
  );
};

export default VehicleSearchForm;
