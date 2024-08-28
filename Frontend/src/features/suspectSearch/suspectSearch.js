import { createSlice } from '@reduxjs/toolkit';

const suspectSearchSlice = createSlice({
  name: 'suspectSearch',
  initialState: {
    isLoading: false,
    data: {
      status: '',
      message: '',
      results: [],
    },
    error: null,
  },
  reducers: {
    suspectSearchStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    suspectSearchSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    suspectSearchFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  suspectSearchStart,
  suspectSearchSuccess,
  suspectSearchFailure,
} = suspectSearchSlice.actions;

export default suspectSearchSlice.reducer;
