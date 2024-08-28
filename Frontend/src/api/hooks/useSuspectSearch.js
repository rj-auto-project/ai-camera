import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

const postSuspectSearch = async (inputData) => {
  const response = await axios.post(
    `${BASE_URL}/operations/suspect-search`,
    inputData,
    config()
  );
  return response.data;
};

const useSuspectSearch = () => {
  const queryClient = useQueryClient();
  const [eventData, setEventData] = useState([]);
  const eventSourceRef = useRef(null);

  const mutation = useMutation(postSuspectSearch, {
    onSuccess: (data) => {
      queryClient.setQueryData(["suspectSearch"], data);

      // Start EventSource to get real-time updates
      eventSourceRef.current = new EventSource(
        `${BASE_URL}/operations/suspect-search`
      );

      eventSourceRef.current.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setEventData((prevData) => [...prevData, parsedData]);

        // Optionally update the cache with new data
        queryClient.setQueryData(["suspectSearch"], (oldData) => [
          ...(oldData || []),
          parsedData,
        ]);
      };

      eventSourceRef.current.onerror = (error) => {
        console.error("EventSource failed: ", error);
        eventSourceRef.current.close();
      };
    },
  });

  // Function to manually close the EventSource connection
  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // Clean up EventSource when the component unmounts
  useEffect(() => {
    return () => {
      closeEventSource();
    };
  }, []);

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    eventData,
    closeEventSource, 
  };
};

export default useSuspectSearch;
