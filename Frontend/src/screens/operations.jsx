import React, { useEffect, useState } from "react";
import { useFetchOperations } from "../api/hooks/useFetchOperations.js";
import OperationsTable from "../components/table/OperationsTable.jsx";
import {
  Chip,
  CircularProgress,
  Stack,
  Box,
  Typography,
  // InputBase,
  // Typography,
} from "@mui/material";
import {
  operationStatusValues,
  operationTypeValues,
} from "../utils/constants.js";
import MultipleSelectChip from "../components/Input/MultipleSelectChips.jsx";

const Operations = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [opTypes, setSelectedOpTypes] = useState([]);

  console.log(opTypes, "opTypes");

  const { operations, isLoading, isError, error, refetch } = useFetchOperations(
    {
      type,
      opTypes,
    },
  );

  useEffect(() => {
    refetch();
  }, [opTypes, type]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          backgroundColor: "transparent",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(operations, "op data");

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#131313",
        }}
      >
        {/* Left Side: Chips */}
        <Stack direction="row" spacing={2}>
          {operationStatusValues.map((chip, index) => (
            <Chip
              key={index}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "500", fontSize: 13 }}
                >
                  {chip.label}
                </Typography>
              }
              onClick={() => setType(chip.value)}
              sx={{
                ...(chip.value === type && {
                  bgcolor: "#3f51b5",
                  ":hover": {
                    bgcolor: "#3f51b5",
                  },
                }),
              }}
            />
          ))}
        </Stack>
        {/* Operation Type Chip */}
        <MultipleSelectChip
          chipsData={operationTypeValues}
          selectedChips={opTypes}
          setSelectedChips={setSelectedOpTypes}
        />
        {/* Right Side: Search and Pulsing Dot */}
        {/* <Box display="flex" alignItems="center" gap={2}>
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
              width: "300px",
            }}
          />
        </Box> */}
      </Box>

      {/* Scrollable Table Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto", // Make the table content scrollable
          backgroundColor: "#1c1c1c",
        }}
      >
        {operations.length > 0 && <OperationsTable data={operations} />}
        {isError && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Typography variant="h6" color="error">
              Error fetching operations
            </Typography>
          </Box>
        )}
        {!operations.length && !isError && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Typography variant="h6" color="textSecondary">
              No operations available
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Operations;
