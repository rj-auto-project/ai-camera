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
  Button,
  Box,
  Icon,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ImageModel from "../model/imageModel";
import CSVButton from "../CSVButton";

const VehicleSearchTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  if (!data || !data.results) {
    return (
      <Typography
        sx={{
          height: "100vh",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          fontWeight: "bold",
        }}
      >
        {data.message ? data.message : "No data available!"}
      </Typography>
    );
  }

  const headers = [
    { label: "Thumbnail", key: "thumbnail" },
    { label: "Time Stamp", key: "timestamp" },
    { label: "Camera IP", key: "camera_ip" },
    { label: "Vehicle", key: "detectionClass" },
    { label: "Confidence", key: "classConfidence" },
    { label: "Top Color", key: "topColor" },
    { label: "Bottom Color", key: "bottomColor" },
    { label: "License Number", key: "licenseNumber" },
  ];

  const csvData = data.results.map((item) => ({
    thumbnail: `/assets/cctv.jpeg`, // Assuming the thumbnail is the same for all
    timestamp: new Date(item?.timestamp || item?.time_stamp).toLocaleString(),
    camera_ip: item?.camera_ip || item?.camera?.cameraIp,
    detectionClass: item?.detectionClass,
    classConfidence: item?.classConfidence?.toFixed(2),
    topColor: item?.topColor,
    bottomColor: item?.bottomColor,
    licenseNumber: item?.licenseNumber || "N/A",
  }));

  return (
    <Paper style={{ height: "93vh", display: "flex", flexDirection: "column" }}>
      <TableContainer
        style={{ flex: 1, overflow: "auto" }}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px", // Width of the scrollbar
            height: "6px", // Height of the horizontal scrollbar
            backgroundColor: "transparent", // Transparent background for both scrollbars
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#333", // Color of the draggable part of the scrollbar
            borderRadius: "10px", // Roundness of the scrollbar thumb
            border: "1px solid #f9f9f9", // Adds padding around the scrollbar thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#222", // Color when hovering over the scrollbar thumb
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent", // Transparent track for both scrollbars
            borderRadius: "10px", // Roundness of the scrollbar track
          },
          "&::-webkit-scrollbar-track-piece": {
            backgroundColor: "transparent", // The part of the track not covered by the thumb
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent", // The corner where the two scrollbars meet
          },
          "&::-webkit-resizer": {
            backgroundColor: "transparent", // The draggable resizer corner in some elements
          },
        }}
      >
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Time Stamp</BoldTableCell>
              <BoldTableCell>Camera</BoldTableCell>
              <BoldTableCell>Vehicle</BoldTableCell>
              <BoldTableCell>Confidence</BoldTableCell>
              {/* <BoldTableCell>Top Color</BoldTableCell>
              <BoldTableCell>Bottom Color</BoldTableCell> */}
              {data?.results[0]?.license_number && <BoldTableCell>License Number</BoldTableCell>}
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {data.results
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell
                    onClick={() => handleOpen(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/assets/cctv.jpeg"
                      alt={item.licenseNumber || "No License Number"}
                      style={{ width: 100, height: 60, objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(item?.timestamp || item?.time_stamp).toLocaleString()}
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
                        parseFloat(item?.classConfidence || item?.prediction_confidence) < 0.4
                          ? "#f00"
                          : "#0f0",
                    }}
                  >
                    <strong>{item?.classConfidence?.toFixed(2) || item?.prediction_confidence?.toFixed(2)}</strong>
                  </TableCell>
                  {/* <TableCell>{item.topColor}</TableCell>
                  <TableCell>{item.bottomColor}</TableCell> */}
                  {item?.license_number && <TableCell>{item?.license_number || "N/A"}</TableCell>}
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
          count={data.results.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {selectedItem && (
        <ImageModel
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isOpen={isOpen}
          setOpen={setOpen}
        />
        // <Modal open={open} onClose={handleClose}>
        //   <Box
        //     style={{
        //       position: "absolute",
        //       top: "50%",
        //       left: "50%",
        //       transform: "translate(-50%, -50%)",
        //       backgroundColor: "#0e2433",
        //       borderTopLeftRadius: "10px",
        //       borderTopRightRadius: "10px",
        //       alignItems: "center",
        //       width: "80%",
        //       maxWidth: "800px",
        //       maxHeight: "90vh",
        //       boxShadow: 24,
        //       display: "flex",
        //       flexDirection: "column",
        //       overflow: "hidden",
        //     }}
        //   >
        //     <Box
        //       style={{
        //         position: "relative",
        //         width: "100%",
        //         display: "flex",
        //         justifyContent: "flex-end",
        //       }}
        //     >
        //       <IconButton onClick={handleSaveImage} color="inherit">
        //         <SaveIcon style={{ color: "white" }} />
        //       </IconButton>
        //       <IconButton onClick={handleClose} color="inherit">
        //         <CloseIcon style={{ color: "white" }} />
        //       </IconButton>
        //     </Box>
        //     <img
        //       src="/assets/cctv.jpeg"
        //       alt={selectedItem.licenseNumber || "No License Number"}
        //       style={{
        //         width: "100%",
        //         height: "auto",
        //         maxHeight: "80%",
        //         objectFit: "cover",
        //       }}
        //     />
        //     <Box
        //       style={{
        //         width: "100%",
        //         padding: "10px",
        //         backgroundColor: "rgba(0, 0, 0, 0.8)",
        //         color: "white",
        //         textAlign: "center",
        //         position: "absolute",
        //         bottom: 0,
        //         left: 0,
        //         right: 0,
        //         display: "flex",
        //         flexDirection: "row",
        //         justifyContent: "space-between",
        //       }}
        //     >
        //       <Typography variant="body2">
        //         License No: <br />
        //         {selectedItem.licenseNumber || "N/A"}
        //       </Typography>
        //       <Typography variant="body2">
        //         Timestamp: <br />
        //         {new Date(selectedItem.timestamp).toLocaleString()}
        //       </Typography>
        //       <Typography variant="body2">
        //         Camera IP: <br />
        //         {selectedItem.camera_ip}
        //       </Typography>
        //       <Typography variant="body2">
        //         Vehicle: <br />
        //         {selectedItem.detectionClass}
        //       </Typography>
        //     </Box>
        //   </Box>
        // </Modal>
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

export default VehicleSearchTable;
