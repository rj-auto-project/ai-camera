import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  fetchObjectTypeStart,
  fetchObjectTypeSuccess,
  fetchObjectTypeFailure,
} from "../../features/object/objectSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useFetchObjectTypes = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["objectTypes"],
    queryFn: async () => {
      dispatch(fetchObjectTypeStart());
      const response = await axios.get(`${BASE_URL}/objectTypes`, config());
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchObjectTypeSuccess(data));
    },
    onError: (error) => {
      dispatch(
        fetchObjectTypeFailure(error.response?.data?.message || error.message)
      );
    },
  });
};
