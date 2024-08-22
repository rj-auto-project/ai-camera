import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
} from "../features/auth/authSlice";
import {
  fetchCamerasStart,
  fetchCamerasSuccess,
  fetchCamerasFailure,
} from "../features/camera/cameraSlice";

const apiBaseURL = "https://ai-camera.onrender.com/api/v1";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      dispatch(loginStart());
      console.log(data);
      const response = await axios.post(`${apiBaseURL}/auth/login`, data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      localStorage.setItem("token", data.token);
    },
    onError: (error) => {
      dispatch(loginFailure(error.response?.data?.message || error.message));
    },
  });
};

export const useSignup = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      dispatch(signupStart());
      const response = await axios.post(`${apiBaseURL}/auth/register`, data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(signupSuccess(data));
      console.log("signup success", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    },
    onError: (error) => {
      dispatch(signupFailure(error.response?.data?.message || error.message));
    },
  });
};

export const useFetchCameras = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["cameras"],
    queryFn: async () => {
      dispatch(fetchCamerasStart());
      const response = await axios.get(`${apiBaseURL}/map/cameras`);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchCamerasSuccess(data));
    },
    onError: (error) => {
      dispatch(
        fetchCamerasFailure(error.response?.data?.message || error.message)
      );
    },
  });
};
