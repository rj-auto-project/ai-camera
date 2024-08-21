import React, { useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import CustomDrawer from "../components/Drawer";

function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <CustomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1 p-4 bg-darkSurface text-darkText">
        <Button
          onClick={() => setDrawerOpen(true)}
          variant="contained"
          className="mb-4"
        >
          Open Drawer
        </Button>
        <Container>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          {/* Add your dashboard content here */}
        </Container>
      </main>
    </div>
  );
}

export default Dashboard;
