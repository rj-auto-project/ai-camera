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
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SurveyTable = () => {
  const navigate = useNavigate();


  const [surveys, setSurveys] = useState([
    {
      id: 1,
      surveyName: "Urban Transportation Study",
      surveyId: "SURV-2024-001",
      startDestination: "New York City",
      finalDestination: "Boston",
      type: "Transportation",
      surveyDate: "2024-03-15T09:30:00"
    },
    {
      id: 2,
      surveyName: "Regional Connectivity Assessment",
      surveyId: "SURV-2024-002", 
      startDestination: "San Francisco",
      finalDestination: "Los Angeles",
      type: "Infrastructure",
       surveyDate: "2024-03-15T09:30:00"
    },
    {
      id: 3,
      surveyName: "Coastal Route Analysis",
      surveyId: "SURV-2024-003",
      startDestination: "Seattle",
      finalDestination: "Portland",
      type: "Geographic",
       surveyDate: "2024-03-15T09:30:00"
    },
    {
      id: 4,
      surveyName: "Metropolitan Corridor Evaluation",
      surveyId: "SURV-2024-004",
      startDestination: "Chicago",
      finalDestination: "Milwaukee",
      type: "Urban Planning",
      surveyDate: "2024-03-15T09:30:00"
    }
  ]);


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleSurveyAction = (survey) => {
    navigate('/dashboard/survey/surveydetails')
    console.log("Survey Action for:", survey);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };


  return (
    <Paper 
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <TableContainer style={{ flex: 1, overflow: "auto" }}>
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>S.No.</BoldTableCell>
              <BoldTableCell>Survey ID</BoldTableCell>
              <BoldTableCell>Survey Name</BoldTableCell>
              <BoldTableCell>Start Destination</BoldTableCell>
              <BoldTableCell>Final Destination</BoldTableCell>
              <BoldTableCell>Survey Date</BoldTableCell>
              <BoldTableCell>Type</BoldTableCell>
              <BoldTableCell>Actions</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? surveys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : surveys
            ).map((survey, index) => (
                <TableRow key={survey.id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{survey.surveyId}</TableCell>
                <TableCell>{survey.surveyName}</TableCell>
                <TableCell>{survey.startDestination}</TableCell>
                <TableCell>{survey.finalDestination}</TableCell>
                <TableCell>{formatDateTime(survey.surveyDate)}</TableCell>
                <TableCell>{survey.type}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleSurveyAction(survey)}
                  >
                    View All
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {surveys.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography fontWeight="bold">No Surveys Found!</Typography>
          </Box>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={surveys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};


const StickyTableHead = styled(TableHead)({
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: "#121212",
});

const BoldTableCell = styled(TableCell)({
  fontWeight: "bold",
});

export default SurveyTable;