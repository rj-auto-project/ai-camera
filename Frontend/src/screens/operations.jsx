import React, { useEffect, useState } from "react";
import { useFetchObjectTypes } from "../api/hooks/useFetchObjectTypes";
import { useFetchObjectClass } from "../api/hooks/useFetchObjectClass";

const Operations = () => {
  const [cameraList, setCameraList] = useState([]);

  const {
    data: objectTypes,
    isLoading: isObjectTypesLoading,
    isError: isObjectTypesError,
    error: objectTypesError,
  } = useFetchObjectTypes();

  const {
    data: objectClassData,
    isLoading: isObjectClassLoading,
    isError: isObjectClassError,
    error: objectClassError,
  } = useFetchObjectClass("vehicle");
  console.log(objectTypes);
  console.log(objectClassData);

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
