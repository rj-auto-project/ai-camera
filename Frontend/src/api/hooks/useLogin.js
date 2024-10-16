import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/authSlice";
import { BASE_URL } from "../url";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      dispatch(loginStart());
      const response = await axios.post(`${BASE_URL}/auth/login`, data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.userData));
      localStorage.setItem("token", data?.userData?.token);
    },
    onError: (error) => {
      dispatch(loginFailure(error.response?.data?.message || error.message));
    },
  });
};
