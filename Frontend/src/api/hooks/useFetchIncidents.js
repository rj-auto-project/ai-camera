import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  fetchIncidentsStart,
  fetchIncidentsSuccess,
  fetchIncidentsFailure,
} from "../../features/incidents/incidentsSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useFetchIncidents = (dateRange) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["incidents", dateRange],
    queryFn: async () => {
      dispatch(fetchIncidentsStart());
      let endpoint = `${BASE_URL}/incidents`;
      if (dateRange === "today") {
        endpoint += "/today";
      } else if (dateRange === "weekly") {
        endpoint += "/weekly";
      } else if (dateRange === "monthly") {
        endpoint += "/monthly";
      }
      const response = await axios.get(endpoint, config());
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data, "data");
      dispatch(fetchIncidentsSuccess(data.data));
    },
    onError: (error) => {
      dispatch(
        fetchIncidentsFailure(error.response?.data?.message || error.message),
      );
    },
  });
};
