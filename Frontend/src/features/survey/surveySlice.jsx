import { createSlice } from "@reduxjs/toolkit";

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    SurveyFetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    SurveyFetchSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    SurveyFetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { SurveyFetchStart, SurveyFetchSuccess, SurveyFetchFailure } =
  surveySlice.actions;

export default surveySlice.reducer;
