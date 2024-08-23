import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  Grid,
  Box,
} from "@mui/material";
import { useLogin } from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosUnlock } from "react-icons/io";
import PersonIcon from "@mui/icons-material/Person";


function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const { mutate: login, isPending, isError, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    login(
      { employeeId, password },
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
                  <Button size="small" onClick={() => navigate("/signup")}>
                    Sign up
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </nav>
      </Box>

      <Grid container justifyContent="center" alignItems="center" style={{ height: "80vh" }}>
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

            <form onSubmit={handleLogin} className="space-y-4">
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
                      <PersonIcon />
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
                      <IoIosUnlock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                        style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                      >
                        {isPasswordHidden ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </InputAdornment>
                  ),
                }}
              />

              <Box mt={2}>
                <Button
                  type="submit"
                  size="large"
                  disabled={isPending}
                  className="bg-yellow-500 text-white"
                  fullWidth
                  startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </Box>
            </form>

            <Box mt={2} textAlign="center">
              <a href="#" className="hover:text-gray-400">Forget Your Password?</a>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
