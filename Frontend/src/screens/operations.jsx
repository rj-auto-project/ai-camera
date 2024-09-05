import React, { useEffect, useState } from "react";
import { useFetchOperations } from "../api/hooks/useFetchOperations.js";

import { Backdrop, CircularProgress } from "@mui/material";

const Operations = () => {
  const { data, isLoading, isError, error } = useFetchOperations();
  if (data) console.log("Data from operations", data);

  if (isLoading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Operations</h1>
    </div>
  );
};

export default Operations;
