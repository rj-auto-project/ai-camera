import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import CustomDrawer from "../components/Drawer";
import Logout from "./logout";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const Map = lazy(() => import("./map/map"));
const Analytics = lazy(() => import("./analytics"));
const Setting = lazy(() => import("./setting"));
const CreateOperations = lazy(() => import("./createOperations"));
const Operations = lazy(() => import("./operations"));
const ModelWindow = lazy(() => import("../window/operationData"));
const Incidents = lazy(() => import("./incidents"));
const TrackAgent = lazy(() => import("./trackAgent"));
const StreamsConditionalRender = lazy(() => import("../components/conditionalrender/streampage"));

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        dispatch(logout());
        toast.error("Logged out. Session Expired", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            marginLeft: "4%",
          },
        });
        navigate("/");
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dispatch, navigate]);

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
      const payload = JSON.parse(jsonPayload);
      return Math.floor(Date.now() / 1000) > payload.exp;
    } catch (error) {
      return true;
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <CustomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div style={{ flexGrow: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="model" element={<ModelWindow />} />
            <Route path="map" element={<Map />} />
            <Route path="map/create-operations" element={<CreateOperations />} />
            <Route path="operations" element={<Operations />} />
            <Route path="streams" element={<StreamsConditionalRender />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="trackagent" element={<TrackAgent />} />
            <Route path="settings" element={<Setting />} />
          </Routes>
        </Suspense>
      </div>
      <Logout />
    </div>
  );
};

export default Dashboard;