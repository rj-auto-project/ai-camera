import React, { useState } from "react";
import CustomDrawer from "../components/Drawer";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <CustomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Outlet />
    </div>
  );
};

export default Dashboard;
