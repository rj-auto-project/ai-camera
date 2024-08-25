import { createSlice } from "@reduxjs/toolkit";

const objectSlice = createSlice({
  name: "objectTypes",
  initialState: {
    objectTypes: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchObjectTypeStart(state) {
      state.isLoading = true;
    },
    fetchObjectTypeSuccess(state, action) {
      state.isLoading = false;
      state.objectTypes = action.payload;
      state.error = null;
    },
    fetchObjectTypeFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchObjectTypeStart,
  fetchObjectTypeSuccess,
  fetchObjectTypeFailure,
} = objectSlice.actions;

export default objectSlice.reducer;
