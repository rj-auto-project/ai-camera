import React from "react";
import { useForm } from "react-hook-form";
import TextFieldInput from "../Input/TextFieldInput";
import SelectFieldInput from "../Input/SelectFieldInput";
import { Button, Box } from "@mui/material";

const SuspectSearchForm = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const {
    mutate,
    eventData,
    data,
    isLoading,
    isError,
    error,
    closeEventSource,
  } = useSuspectSearch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
      <SelectFieldInput
        name="Select Class"
        label="Class"
        options={allClasses}
        control={control}
        rules={{ required: "Class is required" }}
        error={errors.suspectClass}
        helperText={errors.suspectClass?.message}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <SelectFieldInput
          name="Top Color"
          label="Top Color"
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "black", label: "Black" },
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
          name="Bottom Color"
          label="Bottom Color"
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "black", label: "Black" },
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
      >
        Submit
      </Button>
    </form>
  );
};

export default SuspectSearchForm;
