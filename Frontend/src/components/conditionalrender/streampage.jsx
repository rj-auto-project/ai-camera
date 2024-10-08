import React from "react";
import { useLocation } from "react-router-dom";

import Streams from "../../screens/streams";
import CameraPage from "../../screens/camerapage";

function StreamsConditionalRender() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const camId = queryParams.get("cameraId");

  if (camId) {
    return <CameraPage camId={camId} />;
  }

  return <Streams />;
}

export default StreamsConditionalRender;
