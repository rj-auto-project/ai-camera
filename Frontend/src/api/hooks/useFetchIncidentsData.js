import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../url";
import { config } from "../getConfig";
import { useDispatch } from "react-redux";
import { clearNotifications } from "../../features/notification/notification";

const useFetchIncidentsData = (
  initialPage = 0,
  initialRowsPerPage = 10,
  initialSort = "desc",
  initialFilters = {}
) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sort, setSort] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters); // Contains { incidentType, cameraId, resolved, etc. }
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [incidentsTypes, setIncidentsTypes] = useState([]);
  const [cameras, setCameras] = useState([]);

  const refreshData = async () => {
    setRefreshing(true);
    setFilters({});
    setPage(0);
    setSort("desc");
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
          page: page + 1,
          limit: rowsPerPage,
          sortOrder: sort,
          ...filters,
        },
      });

      setData(response?.data?.data || []);
      setTotal(response?.data?.totalIncidents || 0);
      setIncidentsTypes(response?.data?.incidentsTypes || []);
      setCameras(response?.data?.cameras || []);
      if (page === 0) dispatch(clearNotifications());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page, rowsPerPage, sort, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateSort = (sortOrder) => {
    setSort(sortOrder);
  };

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
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
    updateSort,
    updateFilters,
    incidentsTypes,
    sort,
    cameras,
    filters,
  };
};

export default useFetchIncidentsData;
