import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }, 5000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <h1>Splash Screen...</h1>
    </div>
  );
};

export default SplashScreen;
