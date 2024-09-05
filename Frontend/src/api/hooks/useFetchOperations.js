import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

  return useQuery({
    queryKey: ["operations"],
    queryFn: async () => {
      dispatch(fetchOperationsStart());
      const response = await axios.get(`${BASE_URL}/operations`, config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchOperationsSuccess(data));
    },
    onError: (error) => {
      dispatch(
        fetchOperationsFailure(error.response?.data?.message || error.message),
      );
    },
  });
};
