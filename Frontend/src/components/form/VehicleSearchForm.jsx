import React from "react";
import { useForm } from "react-hook-form";
import TextFieldInput from "../Input/TextFieldInput";
import SelectFieldInput from "../Input/SelectFieldInput";
import { Button } from "@mui/material";

const VehicleSearchForm = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
      <SelectFieldInput
        name="vehicleColor"
        label="Color"
        options={[
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
          { value: "green", label: "Green" },
          { value: "black", label: "Black" },
        ]}
        control={control}
        rules={{ required: "Color is required" }}
        error={errors.vehicleColor}
        helperText={errors.vehicleColor?.message}
      />
      <TextFieldInput
        name="licenseNumber"
        label="License Number"
        type="text"
        control={control}
        rules={{ required: "License Number is required" }}
        error={errors.licenseNumber}
        helperText={errors.licenseNumber?.message}
      />
      <TextFieldInput
        name="ownerName"
        label="Owner Name"
        type="text"
        control={control}
      />
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
      >
        Submit
      </Button>
    </form>
  );
};

export default VehicleSearchForm;
