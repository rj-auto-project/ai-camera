import React, { useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import CustomDrawer from "../components/Drawer";
import { Outlet } from "react-router-dom";

function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{display:"flex"}}>
      <CustomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Outlet />
    </div>
  );
}

export default Dashboard;
