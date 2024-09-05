import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const TextFieldInput = ({
  name,
  label,
  type = "text",
  control,
  rules,
  error,
  helperText,
}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value } }) => (
      <TextField
        fullWidth
        margin="normal"
        label={label}
        type={type}
        value={value || ""}
        onChange={onChange}
        error={!!error}
        helperText={helperText}
        InputLabelProps={type === "datetime-local" ? { shrink: true } : {}}
        sx={{
          input: {
            color: "white",
            "&::-webkit-calendar-picker-indicator": {
              filter: "invert(1)",
            },
            "&::-webkit-clear-button, &::-webkit-inner-spin-button": {
              display: "none",
            },
          },
        }}
      />
    )}
  />
);

export default TextFieldInput;
