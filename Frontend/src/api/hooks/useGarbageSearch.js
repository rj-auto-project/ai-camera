import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  garbageSearchStart,
  garbageSearchSucess,
  garbageSearchFailure,
} from "../../features/garbageSearch/garbageSearch";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useGabageSearch = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(garbageSearchStart());
      const response = await axios.get(`${BASE_URL}/garbagedata`,config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(garbageSearchSucess(data));
    },
    onError: (error) => {
      dispatch(
        garbageSearchFailure(error.response?.data?.message || error.message)
      );
    },
  });
};
