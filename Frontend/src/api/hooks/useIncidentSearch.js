import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  incidentSearchStart,
  incidentSearchSucess,
  incidentSearchFailure,
} from "../../features/incidentSearch/incidentSearch";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useGabageSearch = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(incidentSearchStart());
      const response = await axios.get(`${BASE_URL}/garbagedata`, config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(incidentSearchSucess(data));
    },
    onError: (error) => {
      dispatch(
        incidentSearchFailure(error.response?.data?.message || error.message),
      );
    },
  });
};
