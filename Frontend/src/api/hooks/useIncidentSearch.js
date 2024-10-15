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
import { clearNotifications } from "../../features/notification/notification";

export const useGabageSearch = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(incidentSearchStart());
      const response = await axios.get(`${BASE_URL}/incidents`, config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(incidentSearchSucess(data));
      dispatch(clearNotifications())
    },
    onError: (error) => {
      dispatch(
        incidentSearchFailure(error.response?.data?.message || error.message),
      );
    },
  });
};
