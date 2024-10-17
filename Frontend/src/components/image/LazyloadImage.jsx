import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";

const LazyImage = ({ src, alt, width, height, ...props }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

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
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    e.target.src = "/assets/no_image.jpg";
    e.target.alt = "No Image Available";
    console.log("Image Loading error");
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isLoaded && (
        <CircularProgress
          style={{
            width: 22,
            height: 22,
          }}
        />
      )}
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: isLoaded ? "block" : "none",
            ...props.style,
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
