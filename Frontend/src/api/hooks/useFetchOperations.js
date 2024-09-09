import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOperationsStart,
  fetchOperationsSuccess,
  fetchOperationsFailure,
} from "../../features/operations/operationsSlice";
import { BASE_URL } from "../url";

const token = localStorage.getItem("token");
const url = `${BASE_URL}/operations?token=${token}`;
// const url = `http://localhost:9000/api/v1/operations?token=${token}`;

export const useFetchOperations = () => {
  const dispatch = useDispatch();
  const operationsState = useSelector((state) => state.operations || {});
  const { operations = [], isLoading = false, error = null } = operationsState;

  useEffect(() => {
    dispatch(fetchOperationsStart());

    let eventSource;

    const createEventSource = () => {
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          console.log("event", event);
          const data = JSON.parse(event.data);
          console.log("data", data.data);
          dispatch(fetchOperationsSuccess(data?.data));
        } catch (parseError) {
          console.error("Failed to parse SSE data:", parseError);
          dispatch(fetchOperationsFailure("Failed to parse SSE data"));
        }
      };

      eventSource.onerror = (error) => {
        console.log("SSE error:", error);
        dispatch(
          fetchOperationsFailure(
            error.response?.data?.message ||
              error.message ||
              "SSE connection failed",
          ),
        );
        if (eventSource) eventSource.close();
      };
    };

    createEventSource();
  }, [dispatch]);

  return {
    operations,
    isLoading,
    isError: !!error,
    error,
  };
};
