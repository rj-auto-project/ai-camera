import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";
import { closeLogoutDialog, logout } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.auth.openLogoutDialog);

  const handleClose = () => {
    dispatch(closeLogoutDialog());
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeLogoutDialog());
    navigate("/");
    toast.success("Log out successfully", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        marginLeft: "4%",
      },
    });
    console.log("User logged out");
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
          <IconButton disableRipple sx={{ color: "red", fontSize: 40 }}>
            <WarningIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="logout-dialog-description"
            sx={{ textAlign: "center", fontSize: "1.2rem" }}
          >
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
              marginRight: "8px",
              width: "150px",
            }}
          >
            Log out
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ width: "150px" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Logout;
