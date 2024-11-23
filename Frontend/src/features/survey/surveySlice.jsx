import { createSlice } from "@reduxjs/toolkit";

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    surveyFetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    surveyFetchSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    surveyFetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { surveyFetchStart, surveyFetchSuccess, surveyFetchFailure } =
  surveySlice.actions;

export default surveySlice.reducer;
