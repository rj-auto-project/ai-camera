import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cameraReducer from "./features/camera/cameraSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    camera: cameraReducer,
  },
});

export default store;
