import React, { useRef, useState } from "react";
import { Box, Slider, IconButton } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const CustomVideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume ranges from 0 to 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1); // Current zoom level
  const [selection, setSelection] = useState(null); // Rectangle selection area
  const [isSelecting, setIsSelecting] = useState(false); // If currently selecting an area
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 }); // Starting point of the selection
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 }); // Zoom origin defaults to the center

  const minZoomFactor = 2; // Minimum zoom factor

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

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    videoRef.current.volume = newValue;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.currentTime === videoRef.current.duration) {
      setIsPlaying(false); // Stop the video and reset button when video ends
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeekChange = (event, newValue) => {
    videoRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentNode;
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // For Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // For Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // For IE/Edge
        document.msExitFullscreen();
      }
    } else {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) { // For Safari
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) { // For Firefox
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.msRequestFullscreen) { // For IE/Edge
        videoContainer.msRequestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const zoomOut = () => {
    setScale(1); // Reset the zoom
    setZoomOrigin({ x: 50, y: 50 }); // Reset the zoom origin to the center
  };

  const startSelection = (event) => {
    const rect = videoRef.current.getBoundingClientRect();
    setIsSelecting(true);
    setStartPoint({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const updateSelection = (event) => {
    if (!isSelecting) return;
    const rect = videoRef.current.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;
    setSelection({
      x: Math.min(currentX, startPoint.x),
      y: Math.min(currentY, startPoint.y),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y),
    });
  };

  const finishSelection = () => {
    if (!selection) return;

    const video = videoRef.current;

    // Calculate the zoom factor based on the selected area's size
    const zoomFactor = Math.min(
      video.clientWidth / selection.width,
      video.clientHeight / selection.height
    );

    // Ensure the zoom is at least the minimum zoom factor
    const effectiveZoom = Math.max(zoomFactor, minZoomFactor);

    // Calculate the center of the selected area
    const zoomCenterX = selection.x + selection.width / 2;
    const zoomCenterY = selection.y + selection.height / 2;

    // Calculate zoom origin in percentage relative to video size
    const originX = (zoomCenterX / video.clientWidth) * 100;
    const originY = (zoomCenterY / video.clientHeight) * 100;

    // Set the zoom factor and the new zoom origin
    setScale(effectiveZoom);
    setZoomOrigin({ x: originX, y: originY });

    // Reset selection state
    setIsSelecting(false);
    setSelection(null);
  };

  // Utility to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box
      sx={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}
      onMouseMove={updateSelection}
      onMouseUp={finishSelection}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "auto",
          overflow: "hidden",
          cursor: isSelecting ? "crosshair" : "pointer",
        }}
        onMouseDown={startSelection}
      >
        {/* Only the video element will zoom */}
        <Box sx={{ transform: `scale(${scale})`, transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`, transition: "transform 0.2s ease-out" }}>
          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
        {/* Selection rectangle */}
        {isSelecting && selection && (
          <div
            style={{
              position: "absolute",
              border: "2px dashed #000",
              background: "rgba(0, 0, 0, 0.2)",
              top: `${selection.y}px`,
              left: `${selection.x}px`,
              width: `${selection.width}px`,
              height: `${selection.height}px`,
              pointerEvents: "none",
            }}
          />
        )}
      </Box>

      {/* Controls remain unaffected by zoom */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <Slider
          value={currentTime}
          onChange={handleSeekChange}
          max={duration}
          sx={{ flex: 1, mx: 2 }}
        />

        <Slider
          value={volume}
          onChange={handleVolumeChange}
          max={1}
          step={0.1}
          sx={{ width: 100, marginLeft: 1, marginRight: 2 }}
        />

        {volume > 0 ? (
          <VolumeUpIcon sx={{ width: 50 }} />
        ) : (
          <VolumeOffIcon sx={{ width: 50 }} />
        )}

        <IconButton onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>

        <IconButton onClick={zoomOut} disabled={scale === 1}>
          <ZoomOutIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
      </Box>
    </Box>
  );
};

export default CustomVideoPlayer;
