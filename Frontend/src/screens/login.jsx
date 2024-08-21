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
    <Container className="">
      <Typography variant="h4" className="text-white mb-4">
        Login
      </Typography>
      <form onSubmit={handleLogin} className="space-y-4 w-full">
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white rounded"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white rounded"
        />
        <Button type="submit" variant="contained" fullWidth color="primary">
          Login
        </Button>
      </form>
    </Container>
  );
}

export default Login;
