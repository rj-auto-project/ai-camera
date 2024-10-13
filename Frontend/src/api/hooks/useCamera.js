import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  fetchCamerasStart,
  fetchCamerasSuccess,
  fetchCamerasFailure,
} from "../../features/camera/cameraSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";
import { useState } from "react";

export const useAddCamera = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async (cameraData) => {
      dispatch(fetchCamerasStart());
      const response = await axios.post(
        `${BASE_URL}/settings/cameras`,
        cameraData,
        config()
      );
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      setIsError(false);
      setError(null);
      dispatch(fetchCamerasSuccess(data));
    },
    onError: (error) => {
      setIsLoading(false);
      setIsError(true);
      setError(error);
      dispatch(
        fetchCamerasFailure(error.response?.data?.message || error.message)
      );
    },
  });

  return {
    mutate: mutation.mutateAsync,
    isLoading,
    isError,
    error,
    data: mutation.data,
  };
};

export const useGetCameras = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["getAllCameras"],
    queryFn: async () => {
      dispatch(fetchCamerasStart());
      const response = await axios.get(`${BASE_URL}/cameras`);
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

export const useGetCameraById = (cameraId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["getCamera", cameraId],
    queryFn: async () => {
      dispatch(fetchCamerasStart());
      const response = await axios.get(`${BASE_URL}/cameras/${cameraId}`);
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

export const useUpdateCamera = (cameraId) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (cameraData) => {
      dispatch(fetchCamerasStart());
      const response = await axios.put(
        `${BASE_URL}/settings/cameras/${cameraId}`,
        cameraData,
        config()
      );
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

export const useDeleteCamera = (cameraId) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      dispatch(fetchCamerasStart());
      const response = await axios.delete(`${BASE_URL}/cameras/${cameraId}`);
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
