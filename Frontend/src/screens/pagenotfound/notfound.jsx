import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import "./PageNotFound.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageNotFound = () => {
  const robotRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      robotRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "bounce.out" },
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, delay: 0.5 },
    );

    gsap.fromTo(
      buttonRef.current,
      { scale: 0 },
      { scale: 1, duration: 0.5, delay: 1 },
    );
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-not-found">
      <div className="robot" ref={robotRef}>
        <img src="/robot.svg" alt="Robot" className="robot-img" />
      </div>
      <h1 ref={textRef} style={{ margin: 20 }}>
        404 - Page Not Found
      </h1>
      <p ref={textRef}>Oops! It seems you're lost in space.</p>
      <div ref={buttonRef} className="back-button" onClick={handleBack}>
        <ArrowBackIcon />
        Go Back
      </div>
    </div>
  );
};

export default PageNotFound;
