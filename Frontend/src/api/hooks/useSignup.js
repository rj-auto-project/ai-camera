import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../../features/auth/authSlice";
import { BASE_URL } from "../url";

export const useSignup = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      dispatch(signupStart());
      const response = await axios.post(`${BASE_URL}/auth/register`, data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(signupSuccess(data));
      console.log("signup success", data);
      if (data.token) {
        localStorage.setItem("token", data.userData.token);
      }
    },
    onError: (error) => {
      dispatch(signupFailure(error.response?.data?.message || error.message));
    },
  });
};
