import { createSlice } from '@reduxjs/toolkit';

const cameraSlice = createSlice({
  name: 'camera',
  initialState: {
    cameras: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchCamerasStart(state) {
      state.isLoading = true;
    },
    fetchCamerasSuccess(state, action) {
      state.isLoading = false;
      state.cameras = action.payload;
      state.error = null;
    },
    fetchCamerasFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCamerasStart,
  fetchCamerasSuccess,
  fetchCamerasFailure,
} = cameraSlice.actions;

export default cameraSlice.reducer;
