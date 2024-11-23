import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cameraReducer from "./features/camera/cameraSlice";
import operationsReducer from "./features/operations/operationsSlice";
import notificationsReducer from "./features/notification/notification";
import incidentSearchReducer from "./features/incidentSearch/incidentSearch";
import mapReducer from "./features/camera/cameraSlice";
import surveyReducer from "./features/survey/surveySlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    camera: cameraReducer,
    operations: operationsReducer,
    notifications: notificationsReducer,
    incidentSearch: incidentSearchReducer,
    mapcamera: mapReducer,
    survey: surveyReducer,
  },
});

export default store;
