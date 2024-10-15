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
  localStorage.clear();
  sessionStorage.clear();
};

const initialState = {
  employeeId: null,
  name: null,
  token: null,
  isLoading: false,
  error: null,
  openLogoutDialog: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    ...loadAuthDataFromLocalStorage(),
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
      state.employeeId = action.payload.employee_Id;
      state.name = action.payload.name;
      state.accessLevel = action.payload.access_level;
      state.error = null;

      // Save auth data to local storage
      saveAuthDataToLocalStorage({
        token: state.token,
        employeeId: state.employeeId,
        name: state.name,
        accessLevel: state.accessLevel,
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

    openLogoutDialog: (state) => {
      state.openLogoutDialog = true;
    },

    closeLogoutDialog: (state) => {
      state.openLogoutDialog = false;
    },

    logout(state) {
      state.token = null;
      state.employeeId = null;
      state.name = null;
      state.isLoading = false;
      state.error = null;
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
  openLogoutDialog,
  closeLogoutDialog,
} = authSlice.actions;

export default authSlice.reducer;
