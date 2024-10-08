import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOperationsStart,
  fetchOperationsSuccess,
  fetchOperationsFailure,
} from "../../features/operations/operationsSlice";
import { BASE_URL } from "../url";
import { config } from "../getConfig";
import axios from "axios";

export const useFetchOperations = ({ type, opTypes = [] }) => {
  console.log(type, opTypes, "types");
  let url = `${BASE_URL}/operations`;
  const dispatch = useDispatch();
  const operationsState = useSelector((state) => state.operations || {});
  const { operations = [], isLoading = false, error = null } = operationsState;

  const getOperations = async (url) => {
    dispatch(fetchOperationsStart());
    let data = {
      type: type,
      opTypes: opTypes,
    };
    try {
      const response = await axios.post(url, data, config());
      console.log("response", response.data.operations);
      dispatch(fetchOperationsSuccess(response.data.operations));
    } catch (error) {
      console.log("error", error);
      dispatch(fetchOperationsFailure(error));
    }
  };

  useEffect(() => {
    getOperations(url);
  }, [type, opTypes]);

  return {
    operations,
    isLoading,
    isError: !!error,
    error,
  };
};
