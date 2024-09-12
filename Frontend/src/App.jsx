import React, { useState, Suspense, lazy } from "react";
import { ThemeProvider, CssBaseline, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import darkTheme from "./theme";
import PrivateRoute from "./components/privateRoute";
import NotFound from "./screens/pagenotfound/notfound";
import SplashScreen from "./screens/splashScreen";
import { Toaster } from "react-hot-toast";
import NewWindow from "./window/operationData";

const Login = lazy(() => import("./screens/login"));
const Signup = lazy(() => import("./screens/signup"));
const Dashboard = lazy(() => import("./screens/dashboard"));
const Map = lazy(() => import("./screens/map/map"));
const Reports = lazy(() => import("./screens/reports"));
const StreamsConditionalRender = lazy(
  () => import("./components/conditionalrender/streampage"),
);
const CreateOperations = lazy(() => import("./screens/createOperations"));
const Operations = lazy(() => import("./screens/operations"));

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
                <Route path="/model" element={<NewWindow />} />
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
                  <Route path="reports" element={<Reports />} />
                  <Route
                    path="settings"
                    element={<Typography>Settings</Typography>}
                  />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="center" reverseOrder={false} />
      </div>
    </ThemeProvider>
  );
};

export default App;
