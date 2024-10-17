import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";

const LazyVideo = ({ src, width, height, ...props }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    console.log("Video loading error");
    setIsLoaded(true);
  };

  return (
    <div
      ref={videoRef}
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...props.style,
      }}
    >
      {/* Show loading indicator until the video is loaded */}
      {!isLoaded && (
        <CircularProgress
          style={{
            position: "absolute",
            zIndex: 1,
          }}
        />
      )}

      {/* Only load the video when it's in view */}
      {isIntersecting && (
        <iframe
          src={src}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: isLoaded ? "block" : "none",
            border: "none",
            ...props.style,
          }}
          title="Lazy loaded video"
        />
      )}
    </div>
  );
};

export default LazyVideo;
