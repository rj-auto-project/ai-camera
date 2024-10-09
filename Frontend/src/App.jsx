import React, { useState, Suspense, lazy, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import darkTheme from "./theme";
import PrivateRoute from "./components/privateRoute";
import NotFound from "./screens/pagenotfound/notfound";
import SplashScreen from "./screens/splashScreen";
import { Toaster } from "react-hot-toast";
import Dashboard from "./screens/dashboard";
import addNotification, { Notifications } from "react-push-notification";

const Login = lazy(() => import("./screens/login"));
const Signup = lazy(() => import("./screens/signup"));
const Map = lazy(() => import("./screens/map/map"));
const Analytics = lazy(() => import("./screens/analytics"));
const Setting = lazy(() => import("./screens/setting"));
const CreateOperations = lazy(() => import("./screens/createOperations"));
const Operations = lazy(() => import("./screens/operations"));
const ModelWindow = lazy(() => import("./window/operationData"));
const Incidents = lazy(() => import("./screens/incidents"));
const TrackAgent = lazy(() => import("./screens/trackAgent"));

const StreamsConditionalRender = lazy(
  () => import("./components/conditionalrender/streampage")
);

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className={darkMode ? "dark" : ""}>
        <Router>
          <Suspense>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<PrivateRoute />}>
                <Route path="/model" element={<ModelWindow />} />
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="map">
                    <Route index element={<Map />} />
                    <Route
                      path="create-operations"
                      element={<CreateOperations />}
                    />
                  </Route>
                  <Route path="operations" element={<Operations />} />
                  <Route path="streams">
                    <Route index element={<StreamsConditionalRender />} />
                  </Route>
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="incidents" element={<Incidents />} />
                  <Route path="trackagent" element={<TrackAgent />} />
                  <Route path="settings" element={<Setting />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>

        {/* Toaster for additional notification styles */}
        <Toaster position="center" reverseOrder={false} />

        {/* Notifications positioned at the center */}
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "20%",
            zIndex: 9999,
          }}
        >
          <Notifications />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
