import React from 'react';
import { useForm } from 'react-hook-form';
import TextFieldInput from '../Input/TextFieldInput';
import SelectFieldInput from '../Input/SelectFieldInput';
import { Button } from '@mui/material';

const RestrictedVehicleForm = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '16px' }}>
      <SelectFieldInput
        name="class"
        label="Class"
        options={[
          { value: 'car', label: 'Car' },
          { value: 'bike', label: 'Bike' },
          { value: 'truck', label: 'Truck' },
        ]}
        control={control}
        rules={{ required: "Class is required" }}
        error={errors.class}
        helperText={errors.class?.message}
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
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px', color: "white" }}>
        Submit
      </Button>
    </form>
  );
};

export default RestrictedVehicleForm;