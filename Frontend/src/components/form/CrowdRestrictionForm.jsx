import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextFieldInput from "../Input/TextFieldInput";
import { Button } from "@mui/material";
import { formatDateTime } from "../../utils/formatTime";

const CrowdRestrictionForm = ({ cameraList }) => {
  const [camIds, setCamIds] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (cameraList && cameraList.length > 0) {
      const ids = cameraList.map((camera) => camera.cameraId);
      setCamIds(ids);
    }
  }, [cameraList]);

  const onSubmit = (formData) => {
    const formattedStartTime = formatDateTime(formData.startTime);
    const formattedEndTime = formatDateTime(formData.endTime);
    let data = {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      cameras: camIds,
      threshold: formData.threshold,
    };

    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "16px" }}>
      <TextFieldInput
        name="threshold"
        label="Threshold"
        type="number"
        control={control}
        rules={{ required: "Threshold is required" }}
        error={errors.threshold}
        helperText={errors.threshold?.message}
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

export default CrowdRestrictionForm;
