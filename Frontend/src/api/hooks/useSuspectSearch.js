import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  suspectSearchStart,
  suspectSearchSucess,
  suspectSearchFailure,
} from "../../features/suspectSearch/suspectSearch";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useSuspectSearch = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (requestBody) => {
      dispatch(suspectSearchStart());
      const response = await axios.post(
        `${BASE_URL}/operations/suspect-search`,
        requestBody,
        config()
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(suspectSearchSucess(data));
    },
    onError: (error) => {
      dispatch(
        suspectSearchFailure(error.response?.data?.message || error.message)
      );
    },
  });
};
