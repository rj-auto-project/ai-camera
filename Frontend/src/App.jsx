import React, { useState, Suspense, lazy } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import darkTheme from "./theme";
import PrivateRoute from "./components/privateRoute";
import SplashScreen from "./screens/splashscreen";
import { Toaster } from "react-hot-toast";
import Dashboard from "./screens/dashboard";
import { Notifications } from "react-push-notification";

const Login = lazy(() => import("./screens/login"));
const Signup = lazy(() => import("./screens/signup"));

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className={darkMode ? "dark" : ""}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>

        <Toaster position="center" reverseOrder={false} />
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
