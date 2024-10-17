import React, { useRef, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography, Card } from "@mui/material";
import { useVideo } from "../context/videoContext";
import BackButton from "../components/buttons/backbutton";

const CameraPage = ({ camId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");
  const { videoSrc } = useVideo();
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = window.innerHeight - containerRef.current.offsetTop;
        setContainerHeight(newHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Box
      ref={containerRef}
      width="100%"
      height={`${containerHeight}px`}
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box p={2}>
        <Typography variant="h5">
          <BackButton />
          Camera ID: {camId}
        </Typography>
      </Box>
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          margin: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default CameraPage;
