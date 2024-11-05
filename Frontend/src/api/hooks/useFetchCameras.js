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
      try {
        const response = await axios.get(`${BASE_URL}/map/cameras`, config());
        dispatch(fetchCamerasSuccess(response.data));
        return response.data;
      } catch (error) {
        dispatch(
          fetchCamerasFailure(error.response?.data?.message || error.message),
        );
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
