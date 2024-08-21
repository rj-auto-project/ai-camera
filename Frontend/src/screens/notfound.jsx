import React from "react";
import { Typography, Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h3" component="h1">
        404 - Page Not Found
      </Typography>
    </Box>
  );
};

export default NotFound;
