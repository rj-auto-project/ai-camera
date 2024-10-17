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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ImageModel from "../model/imageModel";
import CSVButton from "../buttons/CSVButton";
import { useNavigate } from "react-router-dom";
import LazyImage from "../image/LazyloadImage";
import useFetchIncidentsData from "../../api/hooks/useFetchIncidentsData.js";

const IncidentSearchTable = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusMap, setStatusMap] = useState({});

  // Use the custom hook to fetch incidents
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
    refreshing
  } = useFetchIncidentsData();

  const handleStatusChange = (e, id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  const handleOpen = (item) => {
    const imageUrl = `http://localhost:6543/${item?.incidentType}/${item?.thumbnail}`;
    const img = new Image();
    img.onload = () => {
      setSelectedItem(item);
      setOpen(true);
    };
    img.onerror = () => {
      console.log("Image not found or invalid. Modal will not open.");
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
                    <strong>Camera ID:</strong> {item?.camera?.cameraId}
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
                  {item?.incidentType === "PEEING" ||
                  item?.incidentType === "SPITTING" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/dashboard/trackagent`)}
                    >
                      Track
                    </Button>
                  ) : (
                    <Select
                      value={statusMap[item.id] || "unresolved"}
                      onChange={(e) => handleStatusChange(e, item.id)}
                    >
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="unresolved">Unresolved</MenuItem>
                    </Select>
                  )}
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
          color="primary"
          onClick={refreshData}
          disabled={refreshing}
          sx={{width:100}}
        >
          {refreshing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Refresh"
          )}
        </Button>
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
          data={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
    </Paper>
  );
};

export default IncidentSearchTable;

// Styled Components
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
