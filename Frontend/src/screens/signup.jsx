import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem("auth", "true");
    navigate("/dashboard");
  };

  return (
    <Container
      maxWidth="xs"
      className="bg-darkSurface p-6 rounded-lg shadow-lg"
    >
      <Typography variant="h4" className="text-darkText mb-4">
        Sign Up
      </Typography>
      <form onSubmit={handleSignup} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default Signup;
