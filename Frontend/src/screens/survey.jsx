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
  CircularProgress,
  AlertTitle,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAllSurveyFetch } from "../api/hooks/useFetchSurvey";
import LocationCell from "../components/buttons/LocationCell";


const SurveyTable = () => {
  const navigate = useNavigate();
  const { mutate: fetchSurveys } = useAllSurveyFetch();
  const { loading, data, error } = useSelector((state) => state.allsurvey);

  const [surveys, setSurveys] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSurveys({ limit: rowsPerPage, page: page + 1 });
  }, [fetchSurveys, rowsPerPage, page]);

  useEffect(() => {
    if (data?.data) {
      const formattedSurveys = data.data.map((survey) => ({
        id: survey.id,
        surveyName: survey.surveyName,
        surveyId: `SURV-${survey.id}`,
        startDestination: survey.initialDestination || "Unknown",
        finalDestination: survey.finalDestination || "Unknown",
        type: survey.type || "Unknown",
        surveyDate: survey.date || new Date().toISOString(),
      }));
      setSurveys(formattedSurveys);
    }
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSurveyAction = (survey) => {
    navigate("/dashboard/survey/surveydetails", {
      state: { surveyId: survey.id },
    });
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="95vh"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: "600px", mx: "auto", mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        Failed to load surveys. Please try again later.
      </Alert>
    );
  }

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
              ? surveys.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : surveys
            ).map((survey, index) => {
              console.log(survey)
              
              return (
                <TableRow key={survey.id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{survey.surveyName}</TableCell>
                  <TableCell><LocationCell coordinates={survey.startDestination}/></TableCell>
                  <TableCell><LocationCell coordinates={survey.finalDestination}/></TableCell>
                  <TableCell>{formatDateTime(survey.surveyDate)}</TableCell>
                  <TableCell>{survey.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="white"
                      onClick={() => handleSurveyAction(survey)}
                    >
                      View Analaytics
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

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
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.totalSurveys || 0}
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
