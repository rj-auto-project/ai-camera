import { createSlice } from "@reduxjs/toolkit";

// Helper functions for local storage
const saveAuthDataToLocalStorage = (authData) => {
  localStorage.setItem("authData", JSON.stringify(authData));
};

const loadAuthDataFromLocalStorage = () => {
  const storedData = localStorage.getItem("authData");
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

const clearAuthDataFromLocalStorage = () => {
  localStorage.removeItem("authData");
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthDataFromLocalStorage() || {
    employeeId: null,
    name: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Login actions
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.employeeId = action.payload.employeeId;
      state.name = action.payload.name;
      state.error = null;

      // Save auth data to local storage
      saveAuthDataToLocalStorage({
        token: state.token,
        employeeId: state.employeeId,
        name: state.name,
      });
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Signup actions
    signupStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess(state, action) {
      state.isLoading = false;
      state.token = action.payload.token;
      state.employeeId = action.payload.employeeId;
      state.name = action.payload.name;
      state.error = null;

      // Save auth data to local storage
      saveAuthDataToLocalStorage({
        token: state.token,
        employeeId: state.employeeId,
        name: state.name,
      });
    },
    signupFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout action
    logout(state) {
      state.token = null;
      state.employeeId = null;
      state.name = null;
      state.isLoading = false;
      state.error = null;

      // Clear local storage
      clearAuthDataFromLocalStorage();
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
