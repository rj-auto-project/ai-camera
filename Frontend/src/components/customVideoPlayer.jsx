import React from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const CustomVideoPlayer = ({ videoSrc }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const videoRef = React.useRef(null);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      if (currentTime === duration) {
        video.currentTime = 0;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeekChange = (event, newValue) => {
    videoRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  return (
    <Box sx={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Video Section with Zoom */}
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <TransformComponent>
              {/* Zoomable and Pannable Video */}
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{
                  width: '100%',
                  height: 'auto',
                  cursor: 'grab',
                }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Controls Section (Positioned at the bottom) */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <IconButton onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <Slider
            value={currentTime}
            onChange={handleSeekChange}
            max={duration}
            sx={{ flex: 1, mx: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomVideoPlayer;
