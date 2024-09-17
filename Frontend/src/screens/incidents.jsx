import React from "react";
import IncidentSearchTable from "../components/table/IncidentSearchTable";
import { Box } from "@mui/material";

const Incidents = () => {
  return (
    <Box sx={{ flex: 1 }}>
      <IncidentSearchTable />
    </Box>
  );
};

export default Incidents;
