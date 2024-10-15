import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cameraReducer from "./features/camera/cameraSlice";
import operationsReducer from "./features/operations/operationsSlice";
import notificationsReducer from './features/notification/notification';

const store = configureStore({
  reducer: {
    auth: authReducer,
    camera: cameraReducer,
    operations: operationsReducer,
    notifications: notificationsReducer,
  },
});

export default store;
