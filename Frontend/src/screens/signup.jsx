import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  Box,
  Grid,
} from "@mui/material";
import { useSignup } from "../api/hooks/useSignup";
import { IoIosUnlock } from "react-icons/io";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

function Signup() {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const { mutate: signup, isPending, isError, error } = useSignup();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    signup(
      { employeeId, name, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: () => {
          console.error("Signup failed:", error);
        },
      },
    );
  };

  return (
    <>
      <Box p={3}>
        <nav>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <a href="#">Home</a>
            </Grid>
            <Grid item>Icon</Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <p>Not a Member? </p>
                </Grid>
                <Grid item>
                  <Button size="small" onClick={() => navigate("/login")}>
                    Log In
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </nav>
      </Box>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        <Grid item xs={7} sm={6} md={6} lg={3}>
          <Box p={4} style={{ backgroundColor: "#333", borderRadius: "8px" }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{ color: "white", fontWeight: "bold" }}
            >
              Login
            </Typography>
            {isError && (
              <Alert severity="error" className="mb-4">
                {error?.response?.data?.message || error.message}
              </Alert>
            )}
            <div>
              <form onSubmit={handleSignup} className="space-y-4">
                <TextField
                  label="Employee Id"
                  type="text"
                  fullWidth
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  variant="standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon size={15} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Employee Name"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope size={15} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  type={isPasswordHidden ? "password" : "text"}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoIosUnlock size={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <button
                          type="button"
                          onClick={() => setPasswordHidden(!isPasswordHidden)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          {isPasswordHidden ? (
                            <FaEyeSlash size={15} />
                          ) : (
                            <FaEye size={15} />
                          )}
                        </button>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="w-full flex items-center justify-center mt-6">
                  <Button
                    type="submit"
                    size="large"
                    disabled={isPending}
                    className="bg-yellow-500 text-white"
                    fullWidth
                    startIcon={
                      isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {isPending ? "Signing..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="py-5 hover:text-gray-400 text-center">
              <a href="#">
                Already have an account? <a>Log in</a>
              </a>
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Signup;
