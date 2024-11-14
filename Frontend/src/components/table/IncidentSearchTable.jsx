import React, { useState } from "react";
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
import ImageModel from "../model/imageModel";
import CSVButton from "../buttons/CSVButton";
import { useNavigate } from "react-router-dom";
import LazyImage from "../image/LazyloadImage";
import useFetchIncidentsData from "../../api/hooks/useFetchIncidentsData.js";
import toast from "react-hot-toast";

const IncidentSearchTable = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusMap, setStatusMap] = useState({});

  const {
    data: incidents,
    total,
    isLoading,
    error,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    refreshData,
    refreshing,
    incidentsTypes,
    updateFilters,
    updateSort,
    sort,
    cameras,
    filters,
    handleMarkWrongDetection,
  } = useFetchIncidentsData();

  console.log(filters);
  const handleStatusChange = (e, id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  console.log(cameras, "cameras");
  const FilterAndSort = () => {
    const handleIncidentTypeChange = (event) => {
      console.log("event.target.value", event.target.value);
      updateFilters({ incidentType: event.target.value });
    };
    const handleCameraIdChange = (event) => {
      updateFilters({ cameraId: event.target.value });
    };

    const handleStatusChange = (event) => {
      updateFilters({ resolved: event.target.value });
    };

    const handleSortChange = () => {
      const newSortOrder = sort === "asc" ? "desc" : "asc";
      updateSort(newSortOrder);
    };

    return (
      <Box display="flex" gap={1} alignItems="center" padding={1}>
        {/* Incident Type Filter */}
        <Select
          value={filters?.incidentType || "Select Incident Type"}
          onChange={handleIncidentTypeChange}
          displayEmpty
          input={<OutlinedInput />}
          renderValue={(selected) =>
            selected?.length === 0 ? "Incident Type" : selected
          }
          style={{ width: 150, height: 40 }}
        >
          <MenuItem value="">
            <em>All Types</em>
          </MenuItem>
          {incidentsTypes?.map((type) => (
            <MenuItem key={type?.incidentType} value={type?.incidentType}>
              {type?.incidentType}
            </MenuItem>
          ))}
        </Select>

        {/* Camera Filter */}
        <Select
          value={
            cameras?.find((camera) => camera?.cameraId === filters?.cameraId)
              ?.cameraName || "All Cameras"
          }
          onChange={handleCameraIdChange}
          displayEmpty
          input={<OutlinedInput />}
          renderValue={(selected) =>
            selected?.length === 0 ? "Camera ID" : selected
          }
          style={{ width: 150, height: 40 }}
        >
          <MenuItem value="">
            <em>All Cameras</em>
          </MenuItem>
          {cameras?.map((camera) => (
            <MenuItem key={camera?.cameraId} value={camera?.cameraId}>
              {camera?.cameraName}
            </MenuItem>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={
            filters?.resolved === undefined || filters?.resolved === ""
              ? "Select Status"
              : filters?.resolved.toString()
          }
          onChange={handleStatusChange}
          displayEmpty
          input={<OutlinedInput />}
          renderValue={(selected) =>
            selected === ""
              ? "Select Status"
              : selected === "true"
                ? "Resolved"
                : "Unresolved"
          }
          style={{ width: 150, height: 40 }}
        >
          <MenuItem value="">
            <em>Select Status</em>
          </MenuItem>
          <MenuItem value="true">Resolved</MenuItem>
          <MenuItem value="false">Unresolved</MenuItem>
        </Select>

        {/* Sort by Timestamp */}
        <Button onClick={() => handleSortChange()} style={{ height: 40 }}>
          Sort by Time ({sort === "asc" ? "Latest First" : "Oldest First"})
        </Button>
      </Box>
    );
  };

  const handleOpen = (item) => {
    // Guard clause to prevent undefined item
    if (!item) {
      console.error('No item provided to handleOpen');
      return;
    }
  
    // Destructure needed properties with default values
    const { incidentType = '', thumbnail = '' } = item;
    
    // Guard clause for required properties
    if (!incidentType || !thumbnail) {
      console.error('Missing required properties:', { incidentType, thumbnail });
      return;
    }
  
    const imageUrl = `http://localhost:6543/${incidentType}/${thumbnail}`;
    
    // Set the item immediately to ensure state is updated
    setSelectedItem(item);
    
    const img = new Image();
    
    img.onload = () => {
      setOpen(true);
    };
    
    img.onerror = () => {
      console.error('Image failed to load:', imageUrl);
      // Reset the selected item if image fails to load
      setSelectedItem(null);
      toast.error('Failed to load image');
    };
    
    img.src = imageUrl;
  };

  const headers = [
    { label: "Thumbnail", key: "thumbnail" },
    { label: "Time Stamp", key: "timestamp" },
    { label: "Camera", key: "camera" },
    { label: "Incident", key: "classConfidence" },
    { label: "Alerts", key: "alerts" },
    { label: "Status", key: "status" },
  ];

  const csvData = incidents?.map((item) => ({
    thumbnail: `http://localhost:6543/${item?.incidentType}/${item?.thumbnail}`,
    timestamp: new Date(item?.timestamp || item?.time_stamp).toLocaleString(),
    camera_ip: item?.camera_ip || item?.camera?.cameraIp,
    detectionClass: item?.detectionClass,
    classConfidence: item?.classConfidence?.toFixed(2),
  }));

  if (isLoading && !incidents.length) {
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

  console.log("incidents", incidents);

  if (error) {
    return (
      <Typography
        sx={{
          height: "96vh",
          display: "flex",
          width: "100vw",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          fontWeight: "bold",
        }}
      >
        {"Error! fetching incident data..."}
      </Typography>
    );
  }

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
          "&::-webkit-scrollbar-track-piece": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent",
          },
          "&::-webkit-resizer": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>S.No.</BoldTableCell>
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Time Stamp</BoldTableCell>
              <BoldTableCell>Camera</BoldTableCell>
              <BoldTableCell>Incident</BoldTableCell>
              <BoldTableCell>Alerts</BoldTableCell>
              <BoldTableCell>Status</BoldTableCell>
              <BoldTableCell>Actions</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {incidents.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {incidents.indexOf(item) + 1 + page * rowsPerPage}
                </TableCell>
                <TableCell
                  onClick={() => handleOpen(item)}
                  style={{ cursor: "pointer" }}
                >
                  <LazyImage
                    src={`http://localhost:6543/${item?.incidentType}/${item?.thumbnail}`}
                    alt={item.licenseNumber || "No License Number"}
                    width={100}
                    height={60}
                  />
                </TableCell>
                <TableCell>
                  {new Date(
                    item?.timestamp || item?.time_stamp
                  ).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div>
                    <strong>Camera IP:</strong> {item?.camera?.cameraIp}
                  </div>
                  <div>
                    <strong>Camera Name:</strong> {item?.camera?.cameraName}
                  </div>
                  <div>
                    <strong>Location:</strong> {item?.camera?.location}
                  </div>
                  <div>
                    <strong>Type:</strong> {item?.camera?.cameraType}
                  </div>
                </TableCell>
                <TableCell>
                  {item?.detectionClass || item?.incidentType}
                </TableCell>
                <TableCell>{item?.alerts || 0}</TableCell>
                <TableCell>
                  <Select
                    value={statusMap[item.id] || "unresolved"}
                    onChange={(e) => handleStatusChange(e, item.id)}
                  >
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="unresolved">Unresolved</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <Select
                      value=""
                      displayEmpty
                      sx={{ width: 200 }}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "notify") {
                          handleOpen(item);
                        } else if (value === "viewCamera") {
                          navigate(
                            `/dashboard/streams?cameraId=${item?.camera?.cameraId}`
                          );
                        } else if (value === "wrongDetection") {
                          handleMarkWrongDetection(item?.id, true);
                        } else if (value === "track") {
                          navigate(`/dashboard/trackagent`);
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Action
                      </MenuItem>
                      <MenuItem value="notify">Notify Traffic Officer</MenuItem>
                      <MenuItem value="viewCamera">View Camera</MenuItem>
                      <MenuItem value="wrongDetection">
                        Wrong detection
                      </MenuItem>
                      {(item?.incidentType === "PEEING" ||
                        item?.incidentType === "SPITTING") && (
                        <MenuItem value="track">Track Agent</MenuItem>
                      )}
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!incidents.length && !error && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Typography fontWeight="bold">No Incidents Found!</Typography>
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
        <CSVButton data={csvData} headers={headers} filename="incidents.csv" />
        <Button
          variant="contained"
          color="white"
          onClick={refreshData}
          disabled={refreshing}
          sx={{ width: 100 }}
        >
          {refreshing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Refresh"
          )}
        </Button>
        <FilterAndSort />
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
    </Paper>
  );
};

export default IncidentSearchTable;

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
