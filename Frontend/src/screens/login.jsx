import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (email === "test@test.com" && password === "password") {
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
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
      <div className=" flex items-center justify-center  h-screen height">
        <div className="w-1/2 grid items-center justify-center  p-8 rounded-lg shadow-lg ">
          <Typography
            variant="h4"
            className="text-white  text-2xl font-bold   text-center"
          >
            Login
          </Typography>
          <div className="flex items-center justify-center">
            <form onSubmit={handleLogin} className="space-y-4 ">
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
                className=" rounded "
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
              <div className="w-full  flex items-center justify-center">
              <Button type="submit" className=" " size="large">
                Login
              </Button>
              </div>
              {/* fullWidth */}
            </form>
          </div>

          <div className="py-5  hover:text-gray-400">
            <a href="">Forget Your Password?</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
