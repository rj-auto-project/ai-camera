import { createSlice } from "@reduxjs/toolkit";

const surveySlice = createSlice({
  name: "allsurvey",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    allSurveyFetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    allSurveyFetchSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    allSurveyFetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  allSurveyFetchStart,
  allSurveyFetchSuccess,
  allSurveyFetchFailure,
} = surveySlice.actions;

export default surveySlice.reducer;
