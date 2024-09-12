import React from "react";
import { Card, CardContent, Typography, Icon, Box } from "@mui/material";

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          color="text.secondary"
        >
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            top: -15,
            right: -15,
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.2,
          }}
        >
          <Icon sx={{ fontSize: 40, color: "white" }}>{icon}</Icon>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
