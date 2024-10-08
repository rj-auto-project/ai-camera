import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  fetchObjectClassStart,
  fetchObjectClassSuccess,
  fetchObjectClassFailure,
} from "../../features/objectClass/objectClassSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";

export const useFetchObjectClass = (objectType) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["objectClass", objectType],
    queryFn: async () => {
      dispatch(fetchObjectClassStart());
      const response = await axios.get(
        `${BASE_URL}/classlist?objectType=${encodeURIComponent(objectType)}`,
        config(),
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchObjectClassSuccess(data));
    },
    onError: (error) => {
      dispatch(
        fetchObjectClassFailure(error.response?.data?.message || error.message),
      );
    },
    enabled: !!objectType,
  });
};
