import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextFieldInput from "../Input/TextFieldInput";
import SelectFieldInput from "../Input/SelectFieldInput";
import { Button, Box, CircularProgress } from "@mui/material";
import { useSuspectSearch } from "../../api/hooks/useSuspectSearch";
import { formatDateTime } from "../../utils/formatTime";
import SuspectSearchTable from "../table/SuspectSearchTable";
import toast from "react-hot-toast";
const SuspectSearchForm = ({ cameraList }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [camIds, setCamIds] = useState([]);

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
  } = useSuspectSearch();

  const allClasses = [
    { value: "apache", label: "Apache" },
    { value: "auto", label: "Auto" },
    { value: "bike-rider", label: "Bike Rider" },
    { value: "bolero", label: "Bolero" },
    { value: "bullet", label: "Bullet" },
    { value: "bus", label: "Bus" },
    { value: "car", label: "Car" },
    { value: "child", label: "Child" },
    { value: "hatchback", label: "Hatchback" },
    { value: "helmet", label: "Helmet" },
    { value: "jcb", label: "JCB" },
    { value: "license-plate", label: "License Plate" },
    { value: "man", label: "Man" },
    { value: "motorbike", label: "Motorbike" },
    { value: "motorbike-rider", label: "Motorbike Rider" },
    { value: "no-helmet", label: "No Helmet" },
    { value: "omni", label: "Omni" },
    { value: "person", label: "Person" },
    { value: "pickup", label: "Pickup" },
    { value: "pulsar", label: "Pulsar" },
    { value: "scooty", label: "Scooty" },
    { value: "scooty-rider", label: "Scooty Rider" },
    { value: "scorpio", label: "Scorpio" },
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "swift", label: "Swift" },
    { value: "thar", label: "Thar" },
    { value: "tractor", label: "Tractor" },
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "woman", label: "Woman" },
  ];

  // useEffect(() => {
  //   setIsResultLoading(true);
  //   const data = JSON.parse(sessionStorage.getItem("suspectSearchData"));
  //   if (data) mutate(data);
  //   setIsResultLoading(false);
  // }, [mutate]);

  const onSubmit = (formData) => {
    console.log("Form data: ", formData);
    console.log("submiting", isLoading);
    const formattedStartTime = formatDateTime(formData.startTime);
    const formattedEndTime = formatDateTime(formData.endTime);

    const data = {
      cameras: camIds,
      classes: [formData.classes],
      top_color: formData.top_color,
      bottom_color: formData.bottom_color,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    console.log("Formatted data: ", data);

    mutate(data);
    toast.success("Suspect search form submitted successfully!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        marginLeft: "4%",
      },
    });

    //TODO: to be implemented
    // sessionStorage.setItem("suspectSearchData", JSON.stringify(data));
  };

  console.log("susupect seach", data);
  console.log("isLoading", isLoading);
  console.log("isError", isError, error);

  return data ? (
    <SuspectSearchTable data={data} />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
      <SelectFieldInput
        name="classes"
        label="Class"
        options={allClasses}
        control={control}
        rules={{ required: "Class is required" }}
        error={errors.suspectClass}
        helperText={errors.suspectClass?.message}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <SelectFieldInput
          name="top_color"
          label="Top Color"
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "black", label: "Black" },
            { value: "white", label: "White" },
            { value: "yellow", label: "Yellow" },
            { value: "orange", label: "Orange" },
          ]}
          control={control}
          rules={{ required: "Color is required" }}
          error={errors.suspectColor}
          helperText={errors.suspectColor?.message}
        />
        {/* <TextFieldInput
        name="passengerCount"
        label="Number of Passengers"
        type="number"
        control={control}
      /> */}

        <SelectFieldInput
          name="bottom_color"
          label="Bottom Color"
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "black", label: "Black" },
            { value: "white", label: "White" },
            { value: "yellow", label: "Yellow" },
            { value: "orange", label: "Orange" },
          ]}
          control={control}
          rules={{ required: "Color is required" }}
          error={errors.suspectColor}
          helperText={errors.suspectColor?.message}
        />
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
        style={{ marginTop: "16px" }}
      >
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
      </Box>
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

export default SuspectSearchForm;
