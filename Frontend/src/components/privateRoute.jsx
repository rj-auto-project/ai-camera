import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

console.log("token",localStorage.getItem("token"))

const PrivateRoute = () => {
  const location = useLocation();
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;
