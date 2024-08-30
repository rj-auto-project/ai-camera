import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Card,
  Container,
  Box,
  Typography,
  Pagination,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { useVideo } from '../context/videoContext';
import video1 from "/assets/videos/output1.mp4";
import video2 from "/assets/videos/output2.mp4";

const Streams = React.memo(() => {
  const [streams, setStreams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation();
  const { setVideoSrc } = useVideo();

  const chipData = [
    { label: "All" },
    { label: "Active" },
    { label: "Inactive" },
  ];

  useEffect(() => {
    const fetchedStreams = [
      {
        id: 1,
        src: video1,
        status: "Active",
      },
      {
        id: 2,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
        status: "Inactive",
      },
      {
        id: 3,
        src: video2,
        status: "Active",
      },
      {
        id: 4,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4",
        status: "Inactive",
      },
      {
        id: 5,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
        status: "Inactive",
      },
      {
        id: 6,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_6mb.mp4",
        status: "Inactive",
      },
      {
        id: 7,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_7mb.mp4",
        status: "Inactive",
      },
      {
        id: 8,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_8mb.mp4",
        status: "Inactive",
      },
      {
        id: 9,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_9mb.mp4",
        status: "Inactive",
      },
      {
        id: 10,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4",
        status: "Inactive",
      },
      {
        id: 11,
        src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_11mb.mp4",
        status: "Inactive",
      },
    ];
    setStreams(fetchedStreams);
  }, []);

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
    [navigate]
  );

  const handleStreamClick = useCallback(
    (id,scr) => {
      setVideoSrc(scr)
      navigate(`?page=${currentPage}&cameraId=${id}`);
    },
    [navigate, currentPage]
  );

  const handleChipClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredStreams = streams.filter(
    (stream) =>
      activeCategory === "All" ||
      (activeCategory === "Active" && stream.status === "Active") ||
      (activeCategory === "Inactive" && stream.status === "Inactive")
  );

  const currentStreams = filteredStreams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
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
            label={chip.label}
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

      <Box mt={9}>
        <Grid container spacing={2}>
          {currentStreams.map((stream) => (
            <Grid item xs={12} sm={6} md={4} key={stream.id}>
              <Card
                onClick={() => handleStreamClick(stream.id,stream.src)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
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
                      CamId: {stream.id}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          bgcolor: stream.status === "Active" ? "red" : "gray",
                          borderRadius: "50%",
                          mr: 0.5,
                        }}
                      />
                      <Typography variant="body2" color="white">
                        {stream.status === "Active" ? "Live" : "Inactive"}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Video Stream */}
                  <video
                      src={stream.src}
                      autoPlay
                      muted
                      loop
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
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
    </Container>
  );
});

export default Streams;
