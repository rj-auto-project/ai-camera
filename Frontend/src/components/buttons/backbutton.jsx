// BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = ({ ...props }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <IconButton onClick={handleBack} {...props}>
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
