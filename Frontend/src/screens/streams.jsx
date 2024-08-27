import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Pagination,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Streams = React.memo(() => {
  const [streams, setStreams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for video streams with camera status
  useEffect(() => {
    const fetchedStreams = [
      { id: 1, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", status: "Active" },
      { id: 2, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4", status: "Inactive" },
      { id: 3, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4", status: "Active" },
      { id: 4, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4", status: "Inactive" },
      { id: 5, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4", status: "Active" },
      { id: 6, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_6mb.mp4", status: "Inactive" },
      { id: 7, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_7mb.mp4", status: "Active" },
      { id: 8, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_8mb.mp4", status: "Inactive" },
      { id: 9, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_9mb.mp4", status: "Active" },
      { id: 10, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4", status: "Inactive" },
      { id: 11, src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_11mb.mp4", status: "Active" },
    ];
    setStreams(fetchedStreams);
  }, []);

  // Parse the query parameters
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
    (id) => {
      navigate(`?page=${currentPage}&cameraId=${id}`);
    },
    [navigate, currentPage]
  );

  const currentStreams = streams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <Box mt={2}>
        <Grid container spacing={4}>
          {currentStreams.map((stream) => (
            <Grid item xs={12} sm={6} md={4} key={stream.id}>
              <Card
                onClick={() => handleStreamClick(stream.id)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  p={0.5}
                  bgcolor={stream.status === "Active" ? "success.main" : "error.main"}
                  color="white"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">CamId: {stream.id}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {stream.status === "Active" && (
                      <>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: "red",
                            borderRadius: "50%",
                            mr: 0.5,
                          }}
                        />
                        <Typography variant="body2">Live</Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <CardMedia
                  component="video"
                  controls
                  src={stream.src}
                  title={`Stream ${stream.id}`}
                  sx={{ flex: 1 }}
                />
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
          count={Math.ceil(streams.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
});

export default Streams;
