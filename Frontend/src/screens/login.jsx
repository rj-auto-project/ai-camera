import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
// import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [isPasswordHidden, setPasswordHidden] = useState(true)
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
              {/* <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
                className=" rounded "
              /> */}
              <div className="relative max-w-">
                <svg
                  className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Employee Id"
                  className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg"
                />
              </div>


              {/* <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                className=""
              /> */}
              <div>
            
            <div className="relative max-w-xs mt-2">
                <button className="text-gray-400 absolute right-3 inset-y-0 my-auto active:text-gray-600"
                    onClick={() => setPasswordHidden(!isPasswordHidden)}
                >
                    {
                        isPasswordHidden ? (
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>

                        )
                    }
                </button>
                <input
                    type={isPasswordHidden ? "password" : "text"}
                    placeholder="Enter your password"
                    className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border  shadow-sm rounded-lg"
                />
            </div>
        </div >


              <div className="w-full  flex items-center justify-center">
              <Button type="submit"  size="large">
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
