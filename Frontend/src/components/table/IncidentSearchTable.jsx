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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ImageModel from "../model/imageModel";
import CSVButton from "../buttons/csvButton";
import { useGabageSearch } from "../../api/hooks/useGarbageSearch";

const IncidentSearchTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [index, setIndex] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const { mutate, data, isLoading, isError, error, closeEventSource } =
    useGabageSearch();

  useEffect(() => {
    mutate();
  }, []);

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
          width: "96vw",
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
        width: "96vw",
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
              <BoldTableCell>class</BoldTableCell>
              <BoldTableCell>Confidence</BoldTableCell>
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
                  <TableCell
                    sx={{
                      color:
                        parseFloat(
                          item?.classConfidence || item?.prediction_confidence
                        ) < 0.4
                          ? "#CD5C5C"
                          : "#90EE90",
                    }}
                  >
                    <strong>
                      {item?.classConfidence?.toFixed(2) ||
                        item?.prediction_confidence?.toFixed(2)}
                    </strong>
                  </TableCell>
                  {item?.license_number && (
                    <TableCell>{item?.license_number || "N/A"}</TableCell>
                  )}
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
