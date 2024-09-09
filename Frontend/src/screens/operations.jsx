import React, { useState } from "react";
import { useFetchOperations } from "../api/hooks/useFetchOperations.js";
import OperationsTable from "../components/table/OperationsTable.jsx";
import {
  Backdrop,
  Chip,
  CircularProgress,
  Stack,
  Menu,
  MenuItem,
  Box,
  InputBase,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";

const chipData = [{ label: "All" }, { label: "Active" }, { label: "Inactive" }];

const Operations = () => {
  // Default the destructured values to avoid errors when they are initially null or undefined
  const { data = {}, isLoading, isError, error } = useFetchOperations();
  const [anchorEl, setAnchorEl] = useState(null);
  const [operationType, setOperationType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (option) => {
    setOperationType(option);
    setAnchorEl(null);
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return data.operations ? (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Fixed Section (Header with Chips and Search Bar) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          padding: "10px",
          boxShadow: "0px 4px 2px -2px gray",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        {/* Left Side: Chips */}
        <Stack direction="row" spacing={2}>
          {chipData.map((chip, index) => (
            <Chip
              key={index}
              label={chip.label}
              onClick={() => console.log(`${chip.label} clicked`)}
            />
          ))}
          {/* Operation Type Chip */}
          <Chip
            label={`Operation Type: ${operationType}`}
            onClick={handleOpenMenu}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleCloseMenu(operationType)}
          >
            <MenuItem onClick={() => handleCloseMenu("Type 1")}>
              Type 1
            </MenuItem>
            <MenuItem onClick={() => handleCloseMenu("Type 2")}>
              Type 2
            </MenuItem>
            <MenuItem onClick={() => handleCloseMenu("Type 3")}>
              Type 3
            </MenuItem>
          </Menu>
        </Stack>

        {/* Right Side: Search and Pulsing Dot */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Search Bar */}
          <InputBase
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "0 10px",
              height: "35px",
              color: "white",
            }}
          />
          {/* Pulsing Green Dot */}
          <Box
            sx={{
              width: "10px",
              height: "10px",
              backgroundColor: green[500],
              borderRadius: "50%",
              boxShadow: `0 0 10px ${green[500]}`,
              animation: "pulse 2s infinite",
            }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: "white" }}>
            Live
          </Typography>
        </Box>
      </Box>

      {/* Scrollable Table Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto", // Make the table content scrollable
          backgroundColor: "#1c1c1c",
        }}
      >
        <OperationsTable data={data.operations} /> {/* Pass real-time data */}
      </Box>
    </div>
  ) : (
    <div>No operations available.</div>
  );
};

export default Operations;
