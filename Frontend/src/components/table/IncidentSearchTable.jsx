import React, { useEffect, useState } from "react";
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
import CSVButton from "../buttons/csvButton";
import { useGabageSearch } from "../../api/hooks/useIncidentSearch";
import { useNavigate } from "react-router-dom";

const IncidentSearchTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [index, setIndex] = useState(null);

  // Track status for each item by its id
  const [statusMap, setStatusMap] = useState({});

  const handleStatusChange = (e, id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  const staticData = [
    {
      id: 2072,
      timestamp: "2024-09-10T11:56:22.638Z",
      cameraId: "1",
      metadata: {
        size: "large",
        color: "green",
      },
      trackId: "track_001",
      camera_ip: "192.168.1.101",
      boxCoords: "10,20,30,40",
      detectionClass: "spitting",
      classConfidence: 0.87,
      topColor: "green",
      bottomColor: "brown",
      licenseNumber: null,
      incidentType: null,
      camera: {
        cameraId: "1",
        cameraIp: "127.0.0.1",
        facingAngle: "90",
        location: "Intersection of Sikar Road and Amer Road",
        coordinates: [26.9124, 75.7873],
        cameraName: "SikarAmerIntersection",
        connectionType: "Wired",
        cameraType: "CCTV",
        status: "ACTIVE",
        installed: "2024-08-01T08:00:00.000Z",
        lastOnline: "2024-08-01T10:00:00.000Z",
        routerIp: "192.168.1.1",
        manufacturer: "Canon",
        crowdThreshold: 50.5,
        areaName: "Subhash Chowk",
      },
    },
    {
      id: 2071,
      timestamp: "2024-09-10T12:17:22.638Z",
      cameraId: "1",
      metadata: {
        size: "large",
        color: "green",
      },
      trackId: "track_001",
      camera_ip: "192.168.1.101",
      boxCoords: "10,20,30,40",
      detectionClass: "peeing",
      classConfidence: 0.87,
      topColor: "green",
      bottomColor: "brown",
      licenseNumber: null,
      incidentType: null,
      camera: {
        cameraId: "1",
        cameraIp: "127.0.0.1",
        facingAngle: "90",
        location: "Intersection of Sikar Road and Amer Road",
        coordinates: [26.9124, 75.7873],
        cameraName: "SikarAmerIntersection",
        connectionType: "Wired",
        cameraType: "CCTV",
        status: "ACTIVE",
        installed: "2024-08-01T08:00:00.000Z",
        lastOnline: "2024-08-01T10:00:00.000Z",
        routerIp: "192.168.1.1",
        manufacturer: "Canon",
        crowdThreshold: 50.5,
        areaName: "Subhash Chowk",
      },
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let { mutate, data, isLoading, isError, error, closeEventSource } =
    useGabageSearch();

  useEffect(() => {
    mutate();
  }, [mutate]);

  console.log("garbage data", data);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (item, index) => {
    setSelectedItem(item);
    setIndex(index);
    setOpen(true);
  };

  if (isLoading || !data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "96vh",
          width: "100%",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (isError) {
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

  const headers = [
    { label: "Thumbnail", key: "thumbnail" },
    { label: "Time Stamp", key: "timestamp" },
    { label: "Camera IP", key: "camera_ip" },
    { label: "Confidence", key: "classConfidence" },
  ];

  const csvData = data.data.map((item, index) => ({
    thumbnail: `/assets/garbage/garbage${index + 1}.png`,
    timestamp: new Date(item?.timestamp || item?.time_stamp).toLocaleString(),
    camera_ip: item?.camera_ip || item?.camera?.cameraIp,
    detectionClass: item?.detectionClass,
    classConfidence: item?.classConfidence?.toFixed(2),
  }));

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
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Time Stamp</BoldTableCell>
              <BoldTableCell>Camera</BoldTableCell>
              <BoldTableCell>Incident</BoldTableCell>
              <BoldTableCell>Action</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {data.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell
                    onClick={() => handleOpen(item, index)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={`/assets/garbage/garbage${index + 1}.png`}
                      alt={item.licenseNumber || "No License Number"}
                      style={{ width: 100, height: 60, objectFit: "cover" }}
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
                  <TableCell>{item?.detectionClass}</TableCell>
                  <TableCell>
                    {/* Render a dropdown to select resolved or unresolved */}
                    <Select
                      value={statusMap[item.id] || "unresolved"} // Get status per row
                      onChange={(e) => handleStatusChange(e, item.id)}
                      sx={{ color: "white" }}
                      MenuProps={{
                        sx: {
                          color: "white",
                        },
                      }}
                    >
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="unresolved">Unresolved</MenuItem>
                    </Select>
                  </TableCell>
                  {item?.license_number && (
                    <TableCell>{item?.license_number || "N/A"}</TableCell>
                  )}
                </TableRow>
              ))}
            {staticData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => {
                    handleOpen(item, index + 4);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`/assets/garbage/garbage${index + 5}.png`}
                    alt={item.licenseNumber || "No License Number"}
                    style={{ width: 100, height: 60, objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(item.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div>
                    <strong>Camera ID:</strong> {item.camera?.cameraId}
                  </div>
                  <div>
                    <strong>Camera Name:</strong> {item.camera?.cameraName}
                  </div>
                  <div>
                    <strong>Location:</strong> {item.camera?.location}
                  </div>
                  <div>
                    <strong>Type:</strong> {item.camera?.cameraType}
                  </div>
                </TableCell>
                <TableCell>{item?.detectionClass}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/dashboard/trackagent`)}
                  >
                    <Typography variant="body1" color="white">
                      Track
                    </Typography>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Export Data Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <CSVButton
          csvData={csvData}
          headers={headers}
          filename={`vehicle_search_data_${new Date().toLocaleString()}.csv`}
          key={`vehicle_search_data_${new Date().toLocaleString()}`}
        />
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={data.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {selectedItem && (
        <ImageModel
          index={index}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isOpen={isOpen}
          setOpen={setOpen}
        />
      )}
    </Paper>
  );
};

const StickyTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.appBar,
}));

const BoldTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

export default IncidentSearchTable;
