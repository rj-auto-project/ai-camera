import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../url";
import { config } from "../getConfig";
import {
  allSurveyFetchFailure,
  allSurveyFetchStart,
  allSurveyFetchSuccess,
} from "../../features/survey/allSurveySlice";
import {
  SurveyFetchFailure,
  SurveyFetchStart,
  SurveyFetchSuccess,
} from "../../features/survey/surveySlice";

export const useAllSurveyFetch = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ page, limit }) => {
      dispatch(allSurveyFetchStart());
      const response = await axios.get(
        `${BASE_URL}/survey/all?limit=${limit}&page=${page}`,
        config()
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(allSurveyFetchSuccess(data));
    },
    onError: (error) => {
      dispatch(
        allSurveyFetchFailure(error.response?.data?.message || error.message)
      );
    },
  });
};

export const useSurveyFetch = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({surveyId}) => {
      dispatch(SurveyFetchStart());
      const response = await axios.get(
        `${BASE_URL}/survey/reports/${surveyId}`,
        config()
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(SurveyFetchSuccess(data));
    },
    onError: (error) => {
      dispatch(
        SurveyFetchFailure(error.response?.data?.message || error.message)
      );
    },
  });
};
