import React, { useEffect, useState } from "react";
import ANPRSearchTable from "../components/table/ANPRSearchTable";
import VehicleSearchTable from "../components/table/VehicleSearchTable";
import SuspectSearchTable from "../components/table/SuspectSearchTable";
import useFetchLiveVehicleSearch from "../api/hooks/live/useFetchLiveVehicleSearch";
import { Box } from "@mui/material";

function NewWindow() {
  const [data, setData] = useState(null);
  const [fetchParams, setFetchParams] = useState(null);

  useEffect(() => {
    window.ipcRenderer.on("new-window-data", (event, data) => {
      setData(data?.operation);
    });
    return () => {
      window.ipcRenderer.removeAllListeners("new-window-data");
    };
  }, []);
  // Trigger fetch when `data` is updated
  useEffect(() => {
    if (data) {
      setFetchParams({
        operationId: data.id,
        opType: data.operationType,
      });
    }
  }, [data]); // Depend on `data`

  // Fetch live vehicle search data
  const { eventData, isLoading, isError, error } = useFetchLiveVehicleSearch(
    fetchParams ? fetchParams : {}, // Use fetchParams for the fetch
  );
  console.log(eventData, "eventData");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error}</div>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          {data.operationType === "ANPR" && (
            <ANPRSearchTable data={eventData} />
          )}

          {data.operationType === "VEHICLE SEARCH" && (
            <VehicleSearchTable data={eventData} isLive />
          )}

          {data.operationType === "SUSPECT SEARCH" && (
            <SuspectSearchTable data={eventData} isLoading={isLoading} />
          )}
        </Box>
      )}
    </Box>
  );
}

export default NewWindow;
