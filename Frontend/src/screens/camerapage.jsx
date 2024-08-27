import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Box, Typography, Card, CardMedia } from "@mui/material";

const CameraPage = () => {
  const { cameraId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");

  // Mock data or fetch the actual stream URL based on `cameraId`
  const streamSrc = `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`;

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Camera {cameraId} - Page {page}
        </Typography>
        <Card>
          <CardMedia
            component="video"
            controls
            src={streamSrc}
            title={`Camera ${cameraId}`}
          />
        </Card>
      </Box>
    </Container>
  );
};

export default CameraPage;
