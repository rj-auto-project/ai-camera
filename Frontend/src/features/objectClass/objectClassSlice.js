import { createSlice } from "@reduxjs/toolkit";

const objectClassSlice = createSlice({
  name: "objectClass",
  initialState: {
    isLoading: false,
    data: [],
    error: null,
  },
  reducers: {
    fetchObjectClassStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchObjectClassSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchObjectClassFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchObjectClassStart,
  fetchObjectClassSuccess,
  fetchObjectClassFailure,
} = objectClassSlice.actions;

export default objectClassSlice.reducer;
