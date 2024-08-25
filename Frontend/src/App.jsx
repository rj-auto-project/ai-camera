import React, { useState, Suspense, lazy } from "react";
import { ThemeProvider, CssBaseline, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import darkTheme from "./theme";
import PrivateRoute from "./components/privateRoute";
import NotFound from "./screens/notFound";
import SplashScreen from "./screens/splashScreen";
import { Toaster } from "react-hot-toast";

const Login = lazy(() => import("./screens/login"));
const Signup = lazy(() => import("./screens/signup"));
const Dashboard = lazy(() => import("./screens/dashboard"));
const Streams = lazy(() => import("./screens/streams"));
const Operations = lazy(() => import("./screens/operations"));
const Map = lazy(() => import("./screens/map/map"));
const Logout = lazy(() => import("./screens/logout"));
const Reports = lazy(() => import("./screens/reports"));

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
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route
                    index
                    element={<Typography>Welcome to the Dashboard</Typography>}
                  />
                  <Route path="map" element={<Map />} />
                  <Route path="map/operations" element={<Operations />} />
                  <Route path="operations" element={<Operations />} />
                  <Route path="streams" element={<Streams />} />
                  <Route
                    path="settings"
                    element={<Typography>Settings</Typography>}
                  />
                  <Route path="reports" element={<Reports />} />
                  <Route path="logout" element={<Logout />} />
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
