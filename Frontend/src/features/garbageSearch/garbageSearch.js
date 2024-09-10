import { createSlice } from "@reduxjs/toolkit";

const garbageSearchSlice = createSlice({
  name: "garbageSearch",
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
    garbageSearchStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    garbageSearchSucess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    garbageSearchFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { garbageSearchStart, garbageSearchSucess, garbageSearchFailure } =
  garbageSearchSlice.actions;

export default garbageSearchSlice.reducer;
