import React, { useState } from "react";
import CustomDrawer from "../components/Drawer";
import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import Logout from "./logout";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function isTokenExpired(token) {
    if (!token) {
      return true;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );

      const payload = JSON.parse(jsonPayload);

      const currentTime = Math.floor(Date.now() / 1000);

      return currentTime > payload.exp;
    } catch (error) {
      return true;
    }
  }

  // Usage
  const token = localStorage.getItem("token");
  const isExpired = isTokenExpired(token);
  if (isExpired) {
    dispatch(logout());
    toast.error("Logged out. session Expired", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        marginLeft: "4%",
      },
    });
    navigate("/");
    console.log("User logged out");
  } else {
    console.log("Token is still valid");
  }

  return (
    <div style={{ display: "flex" }}>
      <CustomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Outlet />
      <Logout />
    </div>
  );
};

export default Dashboard;
