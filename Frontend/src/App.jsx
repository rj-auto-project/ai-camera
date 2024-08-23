import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import darkTheme from "./theme";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Dashboard from "./screens/dashboard";
import Streams from "./screens/streams";
import Operations from "./screens/operations";
import PrivateRoute from "./components/privateRoute";
import NotFound from "./screens/notFound";
import Map from "./screens/map/map";
import SplashScreen from "./screens/splashScreen";
import Logout from "./screens/logout";
import Reports from "./screens/reports";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className={darkMode ? "dark" : ""}>
        <Router>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="" element={<Typography>Welcome to the Dashboard</Typography>} />
                <Route path="map" element={<Map />} />
                <Route path="streams" element={<Streams />} />
                <Route path="operations" element={<Operations />} />
                <Route path="settings" element={<Typography>Settings</Typography>} />
                <Route path="reports" element={<Reports/>} />
                <Route path="logout" element={<Logout/>} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
