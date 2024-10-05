import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../url";
import { useDispatch } from "react-redux";

const token = localStorage.getItem("token");

const useFetchLiveVehicleSearch = ({ operationId, opType }) => {
  console.log(operationId, opType, "operationId, opType");
  const [eventData, setEventData] = useState({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const type =
    opType === "ANPR" || opType === "VEHICLE SEARCH"
      ? "vehicle"
      : "suspect-search";

  // Define the URL for the SSE stream
  const url = `${BASE_URL}/operations/${type}/live?operationId=${operationId}&token=${token}`;
  console.log(url, "url");

  const maxRetries = 5;
  const retryCountRef = useRef(0);
  const eventSourceRef = useRef(null);

  const getLiveData = () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data, "data");
        setEventData((prevState) => ({
          results: [...(prevState?.results || []), ...data],
        }));
        setIsLoading(false);
      };

      eventSource.onerror = () => {
        eventSource.close();
        if (retryCountRef.current < maxRetries) {
          const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
          retryCountRef.current += 1;
          console.warn(
            `Retrying connection in ${retryDelay / 1000} seconds...`,
          );
          setTimeout(() => {
            getLiveData();
          }, retryDelay);
        } else {
          setIsError(true);
          setError(new Error("Maximum retry attempts reached."));
          setIsLoading(false);
        }
      };
    } catch (err) {
      setIsError(true);
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLiveData();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
    // Reset retry count when operationId or opType changes
  }, [operationId, opType]);

  return {
    eventData,
    isLoading,
    isError,
    error,
  };
};

export default useFetchLiveVehicleSearch;
