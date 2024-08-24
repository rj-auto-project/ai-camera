import React, { useEffect, useState } from "react";


const Operations = () => {
  const [cameraList, setCameraList] = useState([]);
  useEffect(() => {
    const storedCameraList = sessionStorage.getItem("selectedCameraList");
   
    if (storedCameraList) {
      setCameraList(JSON.parse(storedCameraList));
    }
  }, []);
  console.log("session camera 1", cameraList);
  return (
    <div>
      <h1>operations</h1>
    </div>
  );
};

export default Operations;
