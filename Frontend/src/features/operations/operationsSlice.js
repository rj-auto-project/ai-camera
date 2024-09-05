import { createSlice } from "@reduxjs/toolkit";

const operationsSlice = createSlice({
  name: "operations",
  initialState: {
    operations: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchOperationsStart(state) {
      state.isLoading = true;
    },
    fetchOperationsSuccess(state, action) {
      state.isLoading = false;
      state.cameras = action.payload;
      state.error = null;
    },
    fetchOperationsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchOperationsStart,
  fetchOperationsSuccess,
  fetchOperationsFailure,
} = operationsSlice.actions;

export default operationsSlice.reducer;
