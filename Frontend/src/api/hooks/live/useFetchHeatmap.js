import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../url";
import { useDispatch } from "react-redux";

const token = localStorage.getItem("token");

const useFetchHeatmap = (type) => {
  const [eventData, setEventData] = useState({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const opType = type === "Crowd" ? "Crowd" : "Traffic";

  const url = `${BASE_URL}/map/heatmap?token=${token}`;

  const maxRetries = 5;
  const retryCountRef = useRef(0);
  const eventSourceRef = useRef(null);

  const getLiveData = () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const eventSource = new EventSource(url);
      console.log(eventSource, "eventSource");
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (opType === "Crowd") {
          data = data?.map((item) => {
            return [
              item.camera.coordinates[0],
              item.camera.coordinates[1],
              item.count,
            ];
          });
        } else {
          data = data.map((item) => {
            return [
              item.camera.coordinates[0],
              item.camera.coordinates[1],
              item.vehicleCount,
            ];
          });
        }
        setEventData(data);
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
  }, [opType]);

  return {
    eventData,
    isLoading,
    isError,
    error,
  };
};

export default useFetchHeatmap;
