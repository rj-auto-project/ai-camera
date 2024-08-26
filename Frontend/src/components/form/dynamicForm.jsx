import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem } from '@mui/material';

const DynamicForm = ({ fields, onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '16px' }}>
      {fields.map((field, index) => (
        <Controller
          key={index}
          name={field.name}
          control={control}
          rules={field.rules || {}}
          render={({ field: { onChange, value } }) => {
            switch (field.type) {
              case 'text':
              case 'datetime-local':
              case 'number':
                return (
                  <TextField
                    fullWidth
                    margin="normal"
                    label={field.type==="datetime-local"?"":field.label}
                    type={field.type}
                    value={value || ''}
                    onChange={onChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                    sx={{
                      input: {
                        color: 'white',
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'invert(1)', // Invert colors to make it white
                        },
                        '&::-webkit-clear-button, &::-webkit-inner-spin-button': {
                          display: 'none',
                        },
                      },
                    }}
                  />
                );
              case 'select':
                return (
                  <TextField
                    select
                    fullWidth
                    margin="normal"
                    label={field.label}
                    value={value || ''}
                    onChange={onChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                  >
                    {field.options.map((option, optionIndex) => (
                      <MenuItem key={optionIndex} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              default:
                return null;
            }
          }}
        />
      ))}
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' , color:"white"}}>
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
