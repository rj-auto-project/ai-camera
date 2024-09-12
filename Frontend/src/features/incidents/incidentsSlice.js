import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incidents: [],
  loading: false,
  error: null,
};

const incidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    fetchIncidentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIncidentsSuccess: (state, action) => {
      state.incidents = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchIncidentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addIncident: (state, action) => {
      state.incidents.push(action.payload);
    },
    updateIncident: (state, action) => {
      const index = state.incidents.findIndex(
        (incident) => incident.id === action.payload.id,
      );
      if (index !== -1) {
        state.incidents[index] = action.payload;
      }
    },
    deleteIncident: (state, action) => {
      state.incidents = state.incidents.filter(
        (incident) => incident.id !== action.payload,
      );
    },
  },
});

export const {
  fetchIncidentsStart,
  fetchIncidentsSuccess,
  fetchIncidentsFailure,
  addIncident,
  updateIncident,
  deleteIncident,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
