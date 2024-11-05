import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  Grid,
  Icon,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const AlertsWidget = ({ alertsData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate totals
  const totalIncidents = alertsData?.length || 0;
  const incidentsWithAlerts = alertsData?.filter((alert) => alert.alerts);
  const totalAlerts = alertsData?.filter((alert) => alert.alerts).length || 0;
  const resolvedAlerts =
    alertsData?.filter((alert) => alert.resolved).length || 0;
  const unresolvedAlerts = totalAlerts - resolvedAlerts;

  // Count incidents by type and find the most frequent incident type
  const incidentCounts =
    incidentsWithAlerts?.reduce((acc, alert) => {
      acc[alert.incidentType] = (acc[alert.incidentType] || 0) + 1;
      return acc;
    }, {}) || {};

  const locationCounts = incidentsWithAlerts?.reduce((acc, alert) => {
    const location = alert.camera?.location || "Unknown Location";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const mostFrequentIncidentType = Object.entries(incidentCounts).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["None", 0]
  );

  const solvedRatio = totalAlerts
    ? Math.round((resolvedAlerts / totalAlerts) * 100)
    : 0;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Box p={3} boxShadow={3}  >
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" color="teal">
          Alerts Analytics
        </Typography>
        <Button
          onClick={toggleExpand}
          endIcon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          variant="contained"
          size="medium"
          color="primary"
          sx={{ bgcolor: "teal" }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </Grid>

      {/* Summary Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" color="grey.400">
            Total Incidents
          </Typography>
          <Typography variant="h6" color="teal">
            <Icon component={FaExclamationCircle} /> {totalIncidents}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" color="grey.400">
            Total Alerts
          </Typography>
          <Typography variant="h6" color="teal">
            <Icon component={FaExclamationCircle} /> {totalAlerts}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" color="grey.400">
            Solved to Unsolved Ratio
          </Typography>
          <Typography variant="h6" color="green">
            <Icon component={FaCheckCircle} /> {`${solvedRatio}%`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={solvedRatio}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" color="grey.400">
            Most Frequent Incident Type
          </Typography>
          <Typography variant="h6" color="error">
            {mostFrequentIncidentType[0]} ({mostFrequentIncidentType[1]} alerts)
          </Typography>
        </Grid>
      </Grid>

      {/* Incident-wise Breakdown */}
      <Collapse in={isExpanded}>
        <Box mt={4} p={2} border={1} borderColor="grey.700" borderRadius={1}>
          <Typography fontWeight="bold" mb={2} color="teal">
            Incident-wise Alerts Breakdown
          </Typography>
          {Object.entries(incidentCounts).map(([incidentType, count]) => (
            <Grid container justifyContent="space-between" key={incidentType}>
              <Typography>{incidentType}</Typography>
              <Typography>{count}</Typography>
            </Grid>
          ))}

          {/* Location-Based Breakdown */}
          <Box mt={4}>
            <Typography fontWeight="bold" mb={2} color="teal">
              Location-Based Alerts
            </Typography>
            {Object.entries(locationCounts).map(([location, count]) => (
              <Grid container justifyContent="space-between" key={location}>
                <Typography>{location}</Typography>
                <Typography>{count}</Typography>
              </Grid>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AlertsWidget;
