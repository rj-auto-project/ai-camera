import React, { useState } from "react";
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
} from "@mui/material";

const VehicleSearchForm = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [formType, setFormType] = useState("");
  const [licenseOption, setLicenseOption] = useState(false);

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
  };

  const handleLicenseOptionChange = (event) => {
    setLicenseOption(event.target.checked);
  };

  return (
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
                options={[
                  { value: "sedan", label: "Sedan" },
                  { value: "suv", label: "SUV" },
                  { value: "truck", label: "Truck" },
                ]}
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
            options={[
              { value: "sedan", label: "Sedan" },
              { value: "suv", label: "SUV" },
              { value: "truck", label: "Truck" },
            ]}
            control={control}
            rules={{ required: "Vehicle Class is required" }}
            error={errors.vehicleClass}
            helperText={errors.vehicleClass?.message}
          />
          <SelectFieldInput
            name="topColor"
            label="Top Color"
            options={[
              { value: "red", label: "Red" },
              { value: "blue", label: "Blue" },
              { value: "green", label: "Green" },
              { value: "black", label: "Black" },
            ]}
            control={control}
            rules={{ required: "Top Color is required" }}
            error={errors.topColor}
            helperText={errors.topColor?.message}
          />
          <SelectFieldInput
            name="bottomColor"
            label="Bottom Color"
            options={[
              { value: "red", label: "Red" },
              { value: "blue", label: "Blue" },
              { value: "green", label: "Green" },
              { value: "black", label: "Black" },
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
      >
        Submit
      </Button>
    </form>
  );
};

export default VehicleSearchForm;
