import { createSlice } from "@reduxjs/toolkit";

const incidentSearchSlice = createSlice({
  name: "incidentSearch",
  initialState: {
    isLoading: false,
    data: {
      status: "",
      message: "",
      results: [],
    },
    error: null,
  },
  reducers: {
    incidentSearchStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    incidentSearchSucess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    incidentSearchFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  incidentSearchStart,
  incidentSearchSucess,
  incidentSearchFailure,
} = incidentSearchSlice.actions;

export default incidentSearchSlice.reducer;
