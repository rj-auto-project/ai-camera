import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
} from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: "MyCustomFont",
    h4: {
      fontFamily: "MyCustomFont",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

const AuthForm = ({ isLogin, onSubmit, isPending, error }) => {
  const [formData, setFormData] = React.useState({
    employeeId: "",
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  console.log("error", error);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    const loginData = {
      employeeId: formData.employeeId,
      password: formData.password,
    };

    const signupData = {
      employeeId: formData.employeeId,
      name: formData.name,
      password: formData.password,
    };

    e.preventDefault();
    onSubmit(isLogin ? loginData : signupData);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "linear-gradient(to bottom right, #1e1e1e, #2d2d2d)",
              borderRadius: 4,
              border: "1px solid #00bcd4",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ mb: 3, color: "#00bcd4" }}
            >
              {isLogin ? "Access System" : "Create Profile"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="employeeId"
                label="Employee ID"
                name="employeeId"
                autoComplete="username"
                autoFocus
                value={formData.employeeId}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              {!isLogin && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error?.response?.data?.error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    "linear-gradient(45deg, #00bcd4 30%, #ff4081 90%)",
                  color: "white",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                disabled={isPending}
              >
                {isPending ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
              </Button>
              {/* <Typography variant="body2" color="text.secondary" align="center">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button
                  onClick={() => navigate(isLogin ? "/signup" : "/login")}
                  color="secondary"
                  sx={{ ml: 1 }}
                >
                  {isLogin ? "Sign up" : "Log in"}
                </Button>
              </Typography> */}
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthForm;
