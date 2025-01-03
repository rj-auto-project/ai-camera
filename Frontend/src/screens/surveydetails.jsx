import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSurveyFetch } from "../api/hooks/useFetchSurvey";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ImageModel from "../components/model/imageModel";
import LazyImage from "../components/image/LazyloadImage";
import MapModal from "../components/model/MapModel";
import { ChartAreaIcon, Map } from "lucide-react";
import CustomModel from "../components/model/CustomModel";
import SurveyScatterPlot from "../components/charts/SurveyScatterPlot";
import Locationcell from "../components/location/Locationcell";
import { downloadReport } from "../api/api";

const DownloadModal = ({ isOpen, onClose, onDownload, downloading }) => {
  return (
    <CustomModel isOpen={isOpen} onClose={onClose} title="Download Report">
      <Box display="flex" flexDirection="row" justifyContent={"center"} alignItems={"center"} gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDownload("pdf")}
          disabled={downloading}
        >
          Download as PDF
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDownload("csv")}
          disabled={downloading}
        >
          Download as CSV
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
        {downloading && <CircularProgress />}
      </Box>
    </CustomModel>
  );
};

const SurveyDetails = () => {
  const location = useLocation();
  const { surveyId } = location.state || {};
  const { mutate: fetchSurveys } = useSurveyFetch();
  const { loading, data, error } = useSelector((state) => state.survey);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    className: "",
  });
  const [sort, setSort] = useState("asc");
  const [downloading, setDownloading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadMode, setDownloadMode] = useState("pdf");

  useEffect(() => {
    if (surveyId) {
      fetchSurveys({ surveyId });
    }
  }, [fetchSurveys, surveyId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (item) => {
    if (!item) {
      console.error("No item provided to handleOpen");
      return;
    }

    const { thumbnail = "" } = item;
    if (!thumbnail) {
      console.error("Missing thumbnail");
      return;
    }

    const imageUrl = `http://localhost:6543/surveys/${thumbnail}`;
    setSelectedItem(item);

    const img = new Image();
    img.onload = () => setOpen(true);
    img.onerror = () => {
      setSelectedItem(null);
      toast.error("Failed to load image");
    };
    img.src = imageUrl;
  };

  const handleRefresh = () => {
    fetchSurveys({ surveyId });
  };

  const filteredData =
    data?.data?.filter((item) => {
      if (filters.className && item.className !== filters.className)
        return false;
      return true;
    }) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    return sort === "asc" ? distA - distB : distB - distA;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const FilterAndSort = () => {
    const uniqueClasses = Array.from(
      new Set(data?.data?.map((item) => item.className))
    );

    return (
      <Box display="flex" gap={1} alignItems="center" padding={1}>
        <Select
          value={filters.className || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, className: e.target.value }))
          }
          displayEmpty
          input={<OutlinedInput />}
          style={{ width: 150, height: 40 }}
        >
          <MenuItem value="">
            <em>All Types</em>
          </MenuItem>
          {uniqueClasses.map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace("-", " ").toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="white"
          onClick={() => setSort((prev) => (prev === "asc" ? "desc" : "asc"))}
          style={{ height: 40 }}
        >
          Sort by Distance ({sort === "asc" ? "↑" : "↓"})
        </Button>
        <Button
          variant="contained"
          color="white"
          onClick={handleRefresh}
          disabled={loading}
          sx={{ width: 100 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Refresh"}
        </Button>
      </Box>
    );
  };

  if (loading && !data?.data?.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="96vh"
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        sx={{
          height: "96vh",
          display: "flex",
          width: "100%",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          fontWeight: "bold",
        }}
      >
        Error loading survey data...
      </Typography>
    );
  }

  const generateColor = (index) => {
    const colors = [
      "#FF5733",
      "#FFD700",
      "#4169E1",
      "#1E90FF",
      "#8B4513",
      "#9932CC",
      "#2E8B57",
      "#4B0082",
      "#CD853F",
      "#DC143C",
      "#FF8C00",
      "#006400",
      "#8B008B",
    ];
    return colors[index % colors.length];
  };

  const surveyData = data?.data?.reduce((acc, { className, distance }) => {
    const numericDistance = parseFloat(distance).toFixed(2);
    const existingClass = acc.find((item) => item.class === className);
    if (existingClass) {
      existingClass.distances.push(Number(numericDistance));
    } else {
      acc.push({
        class: className,
        distances: [Number(numericDistance)],
        color: generateColor(acc.length),
      });
    }
    return acc;
  }, []);

  const handleDownloadReport = async (mode) => {
    try {
      setDownloading(true);
      await downloadReport(surveyId, mode);
    } catch (error) {
      console.error("Failed to download report", error);
      setDownloading(false);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadModal = () => {
    setIsDownloadModalOpen(true);
  };

  return (
    <Paper
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <TableContainer
        style={{ flex: 1, overflow: "auto" }}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#333",
            borderRadius: "10px",
            border: "1px solid #f9f9f9",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#222",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            borderRadius: "10px",
          },
        }}
      >
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>S.No.</BoldTableCell>
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Class Name</BoldTableCell>
              <BoldTableCell>Location</BoldTableCell>
              <BoldTableCell>Distance (m)</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {paginatedData.map((item, index) => {
              const distanceInMeters = parseFloat(item.distance);
              const formattedDistance =
                distanceInMeters < 1000
                  ? `${distanceInMeters.toFixed(2)} m`
                  : `${(distanceInMeters / 1000).toFixed(2)} km`;

              return (
                <TableRow key={item.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell
                    onClick={() => handleOpen(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <LazyImage
                      src={`http://localhost:6543/surveys/${item.thumbnail}`}
                      alt={item.className}
                      width={100}
                      height={60}
                    />
                  </TableCell>
                  <TableCell>
                    {item.className.replace("-", " ").toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Locationcell coordinates={item.location} />
                  </TableCell>
                  <TableCell>{formattedDistance}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {!paginatedData.length && !error && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography fontWeight="bold">No Survey Data Found!</Typography>
          </Box>
        )}
      </TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={0.5}
        bgcolor="#121212"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <FilterAndSort />
          <Button
            onClick={() => setIsMapOpen(true)}
            disabled={loading}
            style={{ height: 40 }}
            variant="contained"
            color="white"
            startIcon={<Map />}
          >
            View Map
          </Button>
          <Button
            onClick={() => setIsChartOpen(true)}
            disabled={loading}
            style={{ height: 40, marginLeft: 10 }}
            variant="contained"
            color="white"
            startIcon={<ChartAreaIcon />}
          >
            Analyze
          </Button>
          <Button
            onClick={handleDownloadModal}
            disabled={downloading}
            style={{ height: 40, marginLeft: 10 }}
            variant="contained"
            color="white"
            startIcon={<ChartAreaIcon />}
          >
            Download Report
          </Button>
        </Box>
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          onDownload={handleDownloadReport}
          downloading={downloading}
        />
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      {isOpen && (
        <ImageModel
          isOpen={isOpen}
          setOpen={setOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        data={sortedData}
        title="Survey Locations"
      />
      <CustomModel
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
        title="Analyze Issues"
      >
        <SurveyScatterPlot data={surveyData} />
      </CustomModel>
    </Paper>
  );
};

export default SurveyDetails;

const StickyTableHead = styled(TableHead)({
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: "#121212",
  width: "100%",
});

const BoldTableCell = styled(TableCell)({
  fontWeight: "bold",
});
