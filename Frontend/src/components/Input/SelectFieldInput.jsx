import React from "react";
import { Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";

const SelectFieldInput = ({
  name,
  label,
  options,
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
        select
        fullWidth
        margin="normal"
        label={label}
        value={value || ""}
        onChange={onChange}
        error={!!error}
        helperText={helperText}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                "&::-webkit-scrollbar": {
                  width: "6px", // Width of the scrollbar
                  backgroundColor: "transparent", // Transparent background for both scrollbars
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#333", // Color of the draggable part of the scrollbar
                  borderRadius: "10px", // Roundness of the scrollbar thumb
                  border: "1px solid #f7f7f7", // Adds padding around the scrollbar thumb
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#222", // Color when hovering over the scrollbar thumb
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent", // Transparent track for both scrollbars
                  borderRadius: "10px", // Roundness of the scrollbar track
                },
                "&::-webkit-scrollbar-track-piece": {
                  backgroundColor: "transparent", // The part of the track not covered by the thumb
                },
                "&::-webkit-scrollbar-corner": {
                  backgroundColor: "transparent", // The corner where the two scrollbars meet
                },
                "&::-webkit-resizer": {
                  backgroundColor: "transparent", // The draggable resizer corner in some elements
                },
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
);

export default SelectFieldInput;
