import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

const anpr = "vehicle-op?type=anpr";
const vehicle = "vehicle-op?type=vehicle";

const type = anpr;

const postVehicleSearch = async (inputData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/operations/${type}`,
      inputData,
      config()
    );
    return response.data;
  } catch (error) {
    console.error("POST request failed: ", error);
    throw new Error("POST request failed");
  }
};

const useVehicleSearch = () => {
  const queryClient = useQueryClient();
  const [eventData, setEventData] = useState([]);
  
  const mutation = useMutation({
    mutationFn: postVehicleSearch,
    onSuccess: (data) => {
      // Update the query cache with the data received from the POST request
      queryClient.setQueryData(["VehicleSearch"], data);
      setEventData(data)
    },
    onError: (error) => {
      console.error("Mutation failed: ", error);
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    eventData, // This might be unused if not using EventSource
  };
};

export default useVehicleSearch;





// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { BASE_URL } from "../url";
// import { config } from "../getConfig";

// const anpr = "vehicle-op?type=anpr";
// const vehicle = "vehicle-op?type=anpr";

// const type = anpr;

// const postVehicleSearch = async (inputData) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/operations/${type}`,
//       inputData,
//       config()
//     );
//     return response.data;
//   } catch (error) {
//     console.error("POST request failed: ", error);
//     throw new Error("POST request failed");
//   }
// };

// const useVehicleSearch = () => {
//   const queryClient = useQueryClient();
//   const [eventData, setEventData] = useState([]);
//   const eventSourceRef = useRef(null);

//   const mutation = useMutation({
//     mutationFn: postVehicleSearch,
//     onSuccess: (data) => {
//       queryClient.setQueryData(["VehicleSearch"], data);
      
//       // Correct URL for EventSource
//       const eventSourceUrl = `${BASE_URL}/operations/${type}`;

//       try {
//         eventSourceRef.current = new EventSource(eventSourceUrl);

//         eventSourceRef.current.onmessage = (event) => {
//           try {
//             const parsedData = JSON.parse(event.data);
//             setEventData((prevData) => [...prevData, parsedData]);
//             queryClient.setQueryData(["VehicleSearch"], (oldData) => [
//               ...(oldData || []),
//               parsedData,
//             ]);
//           } catch (parseError) {
//             console.error("Error parsing event data: ", parseError);
//           }
//         };

//         eventSourceRef.current.onerror = (error) => {
//           console.error("EventSource failed: ", error);
//           eventSourceRef.current.close();
//         };

//       } catch (e) {
//         console.error("Failed to create EventSource: ", e);
//       }
//     },
//   });

//   const closeEventSource = () => {
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//   };

//   useEffect(() => {
//     return () => {
//       closeEventSource();
//     };
//   }, []);

//   return {
//     mutate: mutation.mutate,
//     isLoading: mutation.isLoading,
//     isError: mutation.isError,
//     error: mutation.error,
//     eventData,
//     closeEventSource,
//   };
// };

// export default useVehicleSearch;
