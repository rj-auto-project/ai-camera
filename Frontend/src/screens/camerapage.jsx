import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Box, Typography, Card, CardMedia } from "@mui/material";
import { useVideo } from "../context/videoContext";

const CameraPage = ({ camId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");
  const { videoSrc } = useVideo();

  // Mock data or fetch the actual stream URL based on `cameraId`
  const streamSrc = videoSrc;

  return (
    <Container>
      <Box mt={1}>
        <Typography variant="h5" gutterBottom>
          Camera ID: {camId}
        </Typography>
        <Card>
          <video
            src={streamSrc}
            autoPlay
            muted
            loop
            width="100%"
            height="90%"
            style={{ objectFit: "cover" }}
          />
        </Card>
      </Box>
    </Container>
  );
};

export default CameraPage;
