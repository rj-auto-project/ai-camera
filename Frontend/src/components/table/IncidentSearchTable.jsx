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
import CSVButton from "../buttons/CSVButton";
import { useGabageSearch } from "../../api/hooks/useIncidentSearch";
import { useNavigate } from "react-router-dom";
import { RefreshRounded } from "@mui/icons-material";
import { useSelector } from "react-redux";
import LazyImage from "../image/LazyloadImage";

const IncidentSearchTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Track status for each item by its id
  const [statusMap, setStatusMap] = useState({});

  const handleStatusChange = (e, id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const { isLoading, data, error } = useSelector(
    (state) => state.incidentSearch
  );

  let { mutate, isError } = useGabageSearch();

  useEffect(() => {
    if (!data?.data.length) mutate();
  }, [mutate]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (item, index) => {
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

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading && !data?.data.length) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "96vh",
          width: "100%",
          backgroundColor: "transparent",
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
    { label: "Camera", key: "camera" },
    { label: "Incident", key: "classConfidence" },
    { label: "Alerts", key: "alerts" },
    { label: "Action", key: "action" },
  ];

  const csvData = data?.data?.map((item, index) => ({
    thumbnail: `http://localhost:6543/${item?.incidentType}/${item?.thumbnail}`,
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
              <BoldTableCell>Alerts</BoldTableCell>
              <BoldTableCell>Action</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {data?.data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell
                      onClick={() => handleOpen(item, index)}
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
                      )}
                    </TableCell>
                    {item?.license_number && (
                      <TableCell>{item?.license_number || "N/A"}</TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {!data?.data?.length && !isError && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Typography variant="h6" color="textSecondary">
              No Incidents available
            </Typography>
          </Box>
        )}
      </TableContainer>
      {/* Export Data Button */}
      {data?.data && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CSVButton
              csvData={csvData}
              headers={headers}
              filename={`vehicle_search_data_${new Date().toLocaleString()}.csv`}
              key={`vehicle_search_data_${new Date().toLocaleString()}`}
            />
            <Button
              variant="contained"
              color="primary"
              style={{
                margin: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                <RefreshRounded />
              )}
            </Button>
          </Box>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={data?.data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
      {selectedItem && (
        <ImageModel
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
