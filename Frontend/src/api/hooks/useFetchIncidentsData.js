import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../url";
import { config } from "../getConfig";
import { useDispatch } from "react-redux";
import { clearNotifications } from "../../features/notification/notification";

const useFetchIncidentsData = (initialPage = 0, initialRowsPerPage = 10) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    fetchIncidents();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchIncidents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/incidentspaginated`, {
        ...config(),
        params: {
          page, // passing the current page number
          limit: rowsPerPage, // passing the limit for rows per page
        },
      });
      setData(response?.data?.data || []);
      setTotal(response?.data?.totalIncidents || 0);
      if (page === 0) dispatch(clearNotifications());
      console.log("notification cleared", page);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents(); // Fetch data whenever page or rowsPerPage change
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the page and trigger fetch
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page and reset page to 0
    setPage(0);
  };

  return {
    data,
    total,
    isLoading,
    error,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    refreshData,
    refreshing,
  };
};

export default useFetchIncidentsData;
