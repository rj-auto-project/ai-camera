import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  fetchCamerasStart,
  fetchCamerasSuccess,
  fetchCamerasFailure,
} from "../../features/camera/cameraSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useFetchCameras = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["cameras"],
    queryFn: async () => {
      dispatch(fetchCamerasStart());
      const response = await axios.get(`${BASE_URL}/map/cameras`, config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchCamerasSuccess(data));
    },
    onError: (error) => {
      dispatch(
        fetchCamerasFailure(error.response?.data?.message || error.message),
      );
    },
  });
};
