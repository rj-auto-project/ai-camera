import React from "react";
import { useForm } from "react-hook-form";
import TextFieldInput from "../Input/TextFieldInput";
import SelectFieldInput from "../Input/SelectFieldInput";
import { Button } from "@mui/material";

const SuspectSearchForm = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
      <SelectFieldInput
        name="suspectColor"
        label="Color"
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
      <TextFieldInput
        name="passengerCount"
        label="Number of Passengers"
        type="number"
        control={control}
      />

      <SelectFieldInput
        name="clothColor"
        label="Cloth Color"
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
