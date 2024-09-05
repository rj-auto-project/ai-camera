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
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ANPRSearchTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!data || !data.results) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Paper style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <TableContainer style={{ flex: 1, overflow: "auto" }}>
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Camera IP</BoldTableCell>
              <BoldTableCell>Time Stamp</BoldTableCell>
              <BoldTableCell>License Number</BoldTableCell>
              <BoldTableCell>Prediction Confidence</BoldTableCell>
              <BoldTableCell>Vehicle</BoldTableCell>
              <BoldTableCell>Owner Name</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {data.results
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src="/assets/cctv.jpeg"
                      alt={item.license_number}
                      style={{ width: 100, height: 60, objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>{item.camera_ip}</TableCell>
                  <TableCell>
                    {new Date(item.time_stamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{item?.license_number}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        parseFloat(
                          item?.classConfidence || item?.prediction_confidence,
                        ) < 0.4
                          ? "#CD5C5C"
                          : "#90EE90",
                    }}
                  >
                    {item?.prediction_confidence}
                  </TableCell>
                  <TableCell>{item?.detectionClass}</TableCell>
                  <TableCell>{item?.ownerName}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.results.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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

export default ANPRSearchTable;
