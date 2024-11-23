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
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSurveyFetch } from "../api/hooks/useFetchSurvey";
import { useSelector } from "react-redux";

const SurveyTable = () => {
  const navigate = useNavigate();
  const { mutate: fetchSurveys } = useSurveyFetch();
  const { loading, data, error } = useSelector((state) => state.survey);

  // Use the data fetched from the API instead of hardcoded demo data
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetchSurveys(); // Fetch surveys from API
  }, [fetchSurveys]);


  console.log

  useEffect(() => {
    if (data?.reportsBySurvey) {
      // Map over the fetched survey data and store it in state
      const formattedSurveys = data.reportsBySurvey.map((survey) => ({
        id: survey.id,
        surveyName: survey.surveyName,
        surveyId: `SURV-${survey.id}`, // Assuming this is how you want to generate the ID
        startDestination: data.topInitialDestinations[0]?.initialDestination || "Unknown", // Use default if not available
        finalDestination: data.topFinalDestinations[0]?.finalDestination || "Unknown", // Use default if not available
        type: survey.surveyName, // You can modify this field based on your data structure
        surveyDate: new Date().toISOString(), // Set the date dynamically or from API if available
      }));
      setSurveys(formattedSurveys); // Set the formatted survey data
    }
  }, [data]);

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
    navigate("/dashboard/survey/surveydetails");
    console.log("Survey Action for:", survey);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Paper
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
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
