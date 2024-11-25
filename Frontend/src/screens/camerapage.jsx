import React, { useRef, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography, Card } from "@mui/material";
import { useVideo } from "../context/videoContext";
import BackButton from "../components/buttons/backbutton";
import ReactPlayer from "react-player";
import CustomVideoPlayer from "../components/customVideoPlayer";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import vid1 from "../video/output1.mp4";

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

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
  
    return (
      <div className="tools">
        <button onClick={() => zoomIn()}>+</button>
        <button onClick={() => zoomOut()}>-</button>
        <button onClick={() => resetTransform()}>x</button>
      </div>
    );
  };

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
          {/* <video
            src="https://www.youtube.com/watch?v=fmwThvi4VKs"
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          /> */}
          {/* <ReactPlayer 
          url="https://videos.pexels.com/video-files/3141319/3141319-uhd_2560_1440_25fps.mp4"
          playing 
          controls 
          width="100%" 
          height="auto" 
          style={{ objectFit: "contain" }}
          
        /> */}

  
      <CustomVideoPlayer videoSrc="https://videos.pexels.com/video-files/3141319/3141319-uhd_2560_1440_25fps.mp4" />
      {/* <video src="https://videos.pexels.com/video-files/3141319/3141319-uhd_2560_1440_25fps.mp4"></video> */}
     

    {/* <TransformWrapper
      initialScale={1}
      initialPositionX={400}
      initialPositionY={100}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
          <TransformComponent>
            <img src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600" alt="test" />
            <div>Example text</div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper> */}

          
        </Box>
      </Card>
    </Box>
  );
};

export default CameraPage;
