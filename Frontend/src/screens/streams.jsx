import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Card,
  Box,
  Typography,
  Pagination,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useVideo } from "../context/videoContext";
import { useSelector } from "react-redux";
import { useFetchCameras } from "../api/hooks/useFetchCameras";
import ReactPlayer from "react-player";

const Streams = React.memo(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isError } = useFetchCameras();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation();
  const { setVideoSrc } = useVideo();
  const { data } = useSelector((state) => state.mapcamera);

  const chipData = [
    { label: "ALL" },
    { label: "ACTIVE" },
    { label: "INACTIVE" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page"), 10);
    if (page) setCurrentPage(page);
    else setCurrentPage(1);
  }, [location.search]);

  const handlePageChange = useCallback(
    (event, value) => {
      setCurrentPage(value);
      navigate(`?page=${value}`);
    },
    [navigate],
  );

  const handleStreamClick = useCallback(
    (id, src) => {
      setVideoSrc(src);
      navigate(`?page=${currentPage}&cameraId=${id}`);
    },
    [navigate, currentPage],
  );

  const handleChipClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredStreams = data?.filter(
    (stream) =>
      activeCategory === "ALL" ||
      (activeCategory === "ACTIVE" && stream.status === "ACTIVE") ||
      (activeCategory === "INACTIVE" && stream.status === "INACTIVE"),
  );

  const currentStreams = filteredStreams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: 2,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          overflow: "hidden",
          flexWrap: "wrap",
        }}
        justifyContent="center"
      >
        {chipData.map((chip, index) => (
          <Chip
            key={index}
            label={
              <Typography
                variant="body1"
                sx={{ fontWeight: "500", fontSize: 13 }}
              >
                {chip.label}
              </Typography>
            }
            onClick={() => handleChipClick(chip.label)}
            sx={{
              backgroundColor:
                activeCategory === chip.label ? "#B0B0B0" : "white",
              border: `1.5px solid ${activeCategory === chip.label ? "white" : "black"}`,
              color: "black",
              "&:hover": {
                backgroundColor:
                  activeCategory === chip.label ? "#B0B0B0" : "#D3D3D3",
              },
            }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          mt: 8,
          px: 10,
          height: "85vh",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Grid container spacing={2} height="100%">
          {currentStreams.map((stream, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={stream.cameraId}
              sx={{ height: "29vh" }}
            >
              <Card
                onClick={() => handleStreamClick(stream.id, stream.src)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box position="relative" sx={{ height: "100%" }}>
                  {/* Information Overlay */}
                  <Box
                    position="absolute"
                    top={8}
                    left={8}
                    right={8}
                    zIndex={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="white">
                      CamIP: {stream.cameraIp}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          bgcolor: stream.status === "ACTIVE" ? "red" : "gray",
                          borderRadius: "50%",
                          mr: 0.5,
                        }}
                      />
                      <Typography variant="body2" color="white">
                        {stream.status === "ACTIVE" ? "Live" : "Inactive"}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Video Stream */}
                  {/* <video
                    src={stream.src}
                    autoPlay
                    muted
                    loop
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  /> */}
                  <ReactPlayer
                    url={stream.src} 
                    playing={stream.status === "Active"} 
                    controls 
                    loop 
                    width="100%" 
                    height="100%" 
                    style={{ objectFit: "cover" }}
                  />
                  {/* Video Stream Container */}
                  {/* <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <LazyVideo
                      src={`http://localhost/${stream.cameraId}`}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: "10px" }}
                    />
                  </Box> */}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* No Streams Message */}
      {!currentStreams.length && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100%"
          position="absolute"
          top={0}
          left={0}
        >
          <Typography variant="h6" color="textSecondary">
            No Camera available
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {!!currentStreams.length && (
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          p={2}
        >
          <Pagination
            count={Math.ceil(filteredStreams.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
});

export default Streams;
