import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

const anpr = "vehicle?type=anpr";
const vehicle = "vehicle?type=vehicle_search";

const useVehicleSearch = ({ formType }) => {
  const queryClient = useQueryClient();
  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const type = formType === "anpr" ? anpr : vehicle;

  const mutation = useMutation({
    mutationFn: async (inputData) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/operations/${type}`,
          inputData,
          config(),
        );
        return response.data;
      } catch (error) {
        console.error("POST request failed: ", error);
        throw new Error("POST request failed");
      }
    },
    onMutate: () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["VehicleSearch"], data);
      setEventData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Mutation failed: ", error);
      setIsLoading(false);
      setIsError(true);
      setError(error);
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading,
    isError,
    error,
    data: mutation.data,
    eventData,
  };
};

export default useVehicleSearch;
