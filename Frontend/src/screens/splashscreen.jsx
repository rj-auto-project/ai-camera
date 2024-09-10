import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [animationSpeed, setAnimationSpeed] = useState("2s");

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard/map");
      } else {
        navigate("/login");
      }
    }, 3000);
    const spinTimer = setTimeout(() => {
      setAnimationSpeed("4s");
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(spinTimer);
    };
  }, [navigate]);

  const splashScreenStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "url(path-to-background-image.jpg) no-repeat center center",
    backgroundSize: "cover",
    color: "#fff",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  const splashContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    textShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
  };

  const splashLogoStyle = {
    width: "100px",
    height: "auto",
    marginBottom: "20px",
    animation: `spin ${animationSpeed} linear`,
  };

  return (
    <div style={splashScreenStyle}>
      <div style={splashContentStyle}>
        <img
          src="/assets/logo.png"
          alt="City Crime AI"
          style={splashLogoStyle}
        />
        <h1>AI Surveillance System</h1>
      </div>
      <CircularProgress
        style={{ position: "absolute", bottom: "100px", color: "#fff" }}
        size={40}
        thickness={4}
      />
    </div>
  );
};

export default SplashScreen;
