import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchOperationsStart,
  fetchOperationsSuccess,
  fetchOperationsFailure,
} from "../../features/operations/operationsSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useFetchOperations = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOperationsStart());

    const eventSource = new EventSource(`${BASE_URL}/operations`, config());
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      dispatch(fetchOperationsSuccess(data));
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      dispatch(
        fetchOperationsFailure(
          error.response?.data?.message ||
            error.message ||
            "SSE connection failed",
        ),
      );
      eventSource.close(); // Close the event source on error
    };

    // Clean up the EventSource when the component unmounts
    return () => {
      eventSource.close();
      console.log("SSE connection closed");
    };
  }, [dispatch]);

  return null; // This hook doesn't return anything
};
