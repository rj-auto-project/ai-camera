import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import UserCard from "../card/UserCard";

const UserSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      toast.success("User settings updated successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating the settings."
      );
    }
  };

  return (
    <Box flex={1}>
      <Typography variant="h5" gutterBottom>
        Add User
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              {...register("name", { required: "Name is required" })}
              helperText={
                errors.name ? (
                  <span style={{ color: "red" }}>{errors.name.message}</span>
                ) : (
                  ""
                )
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {errors.password && (
                <span style={{ color: "red" }}>{errors.password.message}</span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employee ID"
              {...register("employee_Id", {
                required: "Employee ID is required",
              })}
              helperText={
                errors.employee_Id ? (
                  <span style={{ color: "red" }}>
                    {errors.employee_Id.message}
                  </span>
                ) : (
                  ""
                )
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="access_level_label">Access Level</InputLabel>
              <Select
                labelId="access_level_label"
                label="Access Level"
                {...register("access_level", {
                  required: "Access Level is required",
                })}
                defaultValue="VIEW"
              >
                {/* <MenuItem value="ADMIN">Admin</MenuItem> */}
                <MenuItem value="WORK">Work</MenuItem>
                <MenuItem value="VIEW">View</MenuItem>
                <MenuItem value="SERVER">Server</MenuItem>
              </Select>
              {errors.access_level && (
                <span style={{ color: "red" }}>
                  {errors.access_level.message}
                </span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Todo: add user edit settings */}
      {/* <hr />
      <Typography variant="h5" gutterBottom mt={2}>
        All Users
      </Typography>
      <Box p={2}>
        <UserCard
          user={{
            name: "John Doe",
            empId: "1234",
            joiningDate: "2021-10-10",
            accessLevel: "VIEW",
          }}
        />
      </Box> */}
    </Box>
  );
};

export default UserSettings;
