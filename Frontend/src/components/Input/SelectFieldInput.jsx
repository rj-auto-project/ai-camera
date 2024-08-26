import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

const SelectFieldInput = ({ name, label, options, control, rules, error, helperText }) => (
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
        value={value || ''}
        onChange={onChange}
        error={!!error}
        helperText={helperText}
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
