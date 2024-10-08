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
  Tooltip,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CameraDetailsModal from "../model/CameraDetailsModal";
import OperationDataModal from "../model/OperationDataModal";
import { formatTimeToIST } from "../../utils/formatTime.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import { green, red } from "@mui/material/colors";

const OperationsTable = ({ data, isError }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [operationData, setOperationData] = useState([]);
  const [dataModal, setDataModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (cameras) => {
    setSelectedCameras(cameras);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenDataModal = (operation) => {
    setOperationData(operation);
    setDataModal(true);
  };

  const handleCloseDataModal = () => {
    setDataModal(false);
  };

  if (!data || !data.length) {
    return <Typography>No data available</Typography>;
  }

  const handleOpenWindow = (operation) => {
    const dataToSend = { operation };
    const modalTitle = "Operation response";
    window.ipcRenderer.send("open-modal-window", dataToSend, modalTitle);
  };

  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Ensure it takes full height
        width: "100%", // Ensure it takes full width
      }}
    >
      {/* TableContainer with flex-grow to expand */}
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
              <BoldTableCell>ID</BoldTableCell>
              <BoldTableCell>Operation Type</BoldTableCell>
              <BoldTableCell>Cameras</BoldTableCell>
              <BoldTableCell>
                Start time <br /> End time
              </BoldTableCell>
              <BoldTableCell>Operation Data</BoldTableCell>
              <BoldTableCell>Operation Status</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((operation) => {
                return (
                  <TableRow key={operation.id}>
                    <TableCell>{operation?.id}</TableCell>
                    <TableCell>{operation?.operationType}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(operation?.cameras)}
                      >
                        <Typography variant="body2" style={{ color: "white" }}>
                          View Details
                        </Typography>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <Tooltip title="Start Time" arrow>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon fontSize="small" color="primary" />
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="textPrimary"
                            >
                              {formatTimeToIST(operation?.initialTimestamp)}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Close Time" arrow>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={1}
                          >
                            <DoneIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" color="textSecondary">
                              {formatTimeToIST(operation?.finalTimestamp)}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleOpenDataModal({
                            data: operation?.operationRequestData,
                            title: `Request Data for ${operation?.id}`,
                            operation: "request",
                          })
                        }
                      >
                        <Typography variant="body2" style={{ color: "white" }}>
                          Request Data
                        </Typography>
                      </Button>
                      <br />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenWindow(operation)}
                      >
                        <Typography variant="body2" style={{ color: "white" }}>
                          Response Data
                        </Typography>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={operation?.operationStatus}
                        sx={{
                          backgroundColor:
                            operation?.operationStatus === "ACTIVE"
                              ? green[500]
                              : red[500],
                          color: "white",
                          fontWeight: "bold",
                          padding: "0 12px",
                          borderRadius: "8px",
                          boxShadow: "0 3px 6px rgba(0,0,0,0.1)", // Adding subtle shadow
                          textTransform: "uppercase", // Capitalizing status
                          fontSize: "0.875rem", // Adjust font size for better readability
                          height: "32px", // Slightly increase height for a sleeker look
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination at the bottom */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CameraDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        cameras={selectedCameras}
      />
      <OperationDataModal
        open={dataModal}
        onClose={handleCloseDataModal}
        operationData={operationData}
      />
    </Paper>
  );
};

// Styled components
const StickyTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.appBar,
}));

const BoldTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

export default OperationsTable;
