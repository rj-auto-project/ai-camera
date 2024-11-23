import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../url";
import { config } from "../getConfig";
import {
  surveyFetchFailure,
  surveyFetchStart,
  surveyFetchSuccess,
} from "../../features/survey/surveySlice";

export const useSurveyFetch = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(surveyFetchStart());
      const response = await axios.get(`${BASE_URL}/survey/analytics`, config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(surveyFetchSuccess(data));
    },
    onError: (error) => {
      dispatch(
        surveyFetchFailure(error.response?.data?.message || error.message)
      );
    },
  });
};
