import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import { useLogin } from "../api/api";

function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isLoading, isError, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    login(
      { employeeId , password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: () => {
          console.error("Login failed:", error);
        },
      }
    );
  };

  return (
    <>
      <nav className="bg-blue-600 p-4 px-32 ">
        <ul className="container mx-auto flex justify-between items-center">
          <li>
            <a href="">Home</a>
          </li>
          <li className="flex">Icon</li>
          <li className="flex items-center justify-center gap-3">
            <p>Not a Member? </p>
            <Button size="small">Sign up</Button>
          </li>
        </ul>
      </nav>
      <div className="flex items-center justify-center h-screen">
        <div className="w-1/2 grid items-center justify-center p-8 rounded-lg shadow-lg">
          <Typography variant="h4" className="text-white text-2xl font-bold text-center">
            Login
          </Typography>
          {isError && (
            <Alert severity="error" className="mb-4">
              {error?.response?.data?.message || error.message}
            </Alert>
          )}
          <div className="flex items-center justify-center">
            <form onSubmit={handleLogin} className="space-y-4">
              <TextField
                label="Employee Id"
                fullWidth
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                variant="standard"
                className="rounded"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                className=""
              />
              <div className="w-full flex items-center justify-center">
                <Button type="submit" className="" size="large" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </div>
            </form>
          </div>
          <div className="py-5 hover:text-gray-400">
            <a href="">Forget Your Password?</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
