import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cameraReducer from "./features/camera/cameraSlice";
import operationsReducer from "./features/operations/operationsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    camera: cameraReducer,
    operations: operationsReducer,
  },
});

export default store;
