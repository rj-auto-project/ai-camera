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
import ImageModel from "../model/imageModel";

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
      <Typography sx={{height:"100vh", display:"flex", textAlign: "center", alignItems:"center",justifyContent:"center", marginTop: 2, fontWeight:"bold" }}>
        {data.message ? data.message : "No data available!"}
      </Typography>
    );
  }

  return (
    <Paper style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <TableContainer style={{ flex: 1, overflow: "auto" }}>
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Time Stamp</BoldTableCell>
              <BoldTableCell>Camera IP</BoldTableCell>
              <BoldTableCell>Vehicle</BoldTableCell>
              <BoldTableCell>Confidence</BoldTableCell>
              <BoldTableCell>Top Color</BoldTableCell>
              <BoldTableCell>Bottom Color</BoldTableCell>
              <BoldTableCell>License Number</BoldTableCell>
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
                    {new Date(item.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{item.camera_ip}</TableCell>
                  <TableCell>{item.detectionClass}</TableCell>
                  <TableCell>{item.classConfidence.toFixed(2)}</TableCell>
                  <TableCell>{item.topColor}</TableCell>
                  <TableCell>{item.bottomColor}</TableCell>
                  <TableCell>{item.licenseNumber || "N/A"}</TableCell>
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
