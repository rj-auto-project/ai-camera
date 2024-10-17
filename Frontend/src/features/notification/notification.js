import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    notificationCount: 0,
    error: null,
  },
  reducers: {
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    addNotificationCount(state, action) {
      state.notificationCount = action.payload;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.notificationCount = 0;
    },
    notificationError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  addNotification,
  clearNotifications,
  notificationError,
  addNotificationCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
