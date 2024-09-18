import React, { useState, useMemo, useCallback } from "react";
import { useFetchIncidents } from "../api/hooks/useFetchIncidents";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Alert,
  useTheme,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReportIcon from "@mui/icons-material/Report";
import IncidentsChart from "../components/charts/IncidentsChart";
import PieChart from "../components/charts/PieChart";
import IncidentTypeLineChart from "../components/charts/IncidentTypeLineChart";
import TopIncidentsList from "../components/TopIncidentsList";
import CameraIncidentBarChart from "../components/charts/CameraIncidentBarChart";
import ScatterPlot from "../components/charts/ScatterPlot";
import BubbleChart from "../components/charts/BubbleChart";
import TimeAreaChart from "../components/charts/TimeAreaChart";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const incidentTypes = {
  vehicleAndRoad: [
    "REDLIGHT_VIOLATION",
    "OVERSPEEDING",
    "ILLEGAL_PARKING",
    "WRONG_WAY_DRIVING",
    "ACCIDENT",
    "VEHICLE_RESTRICTION",
  ],
  municipal: ["CROWD_RESTRICTION", "GARBAGE", "POTHOLE", "CATTLE"],
};

export default function Analytics() {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState("today");
  const [selectedIncidentType, setSelectedIncidentType] =
    useState("allIncidents");

  const { data: incidentData, isLoading } = useFetchIncidents(dateRange);

  const {
    filteredData,
    totalIncidents,
    incidentTrendData,
    pieChartData,
    incidentTypeLineChartData,
    mostCommonIncidentType,
    topIncidentTypes,
  } = useMemo(() => {
    if (!incidentData?.data || !Array.isArray(incidentData?.data)) {
      return {
        filteredData: [],
        totalIncidents: 0,
        incidentTrendData: [],
        pieChartData: [],
        incidentTypeLineChartData: { labels: [], datasets: [] },
        mostCommonIncidentType: { type: "", count: 0 },
        topIncidentTypes: [],
      };
    }

    const now = dayjs();
    let startDate;

    switch (dateRange) {
      case "today":
        startDate = now.startOf("day");
        break;
      case "weekly":
        startDate = now.subtract(7, "day");
        break;
      case "monthly":
        startDate = now.subtract(1, "month");
        break;
      default:
        startDate = now.startOf("day");
    }

    const filtered = incidentData?.data?.filter((incident) => {
      const incidentDate = dayjs(incident.timestamp);
      return (
        incidentDate.isAfter(startDate) &&
        (selectedIncidentType === "allIncidents" ||
          (selectedIncidentType === "vehicleAndRoad" &&
            incidentTypes.vehicleAndRoad.includes(incident.incidentType)) ||
          (selectedIncidentType === "municipal" &&
            incidentTypes.municipal.includes(incident.incidentType)))
      );
    });

    // Calculate incidentTrendData
    const trendData = {};
    filtered.forEach((incident) => {
      const date = dayjs(incident.timestamp).format("YYYY-MM-DD");
      trendData[date] = (trendData[date] || 0) + 1;
    });
    const incidentTrendData = Object.entries(trendData)
      .map(([date, count]) => ({
        date,
        incidents: count,
      }))
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

    // Calculate pieChartData and barChartData
    const typeCounts = {};
    filtered.forEach((incident) => {
      typeCounts[incident.incidentType] =
        (typeCounts[incident.incidentType] || 0) + 1;
    });
    const pieChartData = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Calculate data for IncidentTypeLineChart
    const incidentTypeData = {};
    filtered.forEach((incident) => {
      const date = dayjs(incident.timestamp).format("YYYY-MM-DD");
      if (!incidentTypeData[incident.incidentType]) {
        incidentTypeData[incident.incidentType] = {};
      }
      incidentTypeData[incident.incidentType][date] =
        (incidentTypeData[incident.incidentType][date] || 0) + 1;
    });

    const allDates = [
      ...new Set(
        filtered.map((incident) =>
          dayjs(incident.timestamp).format("YYYY-MM-DD")
        )
      ),
    ].sort();

    const incidentTypeLineChartData = {
      labels: allDates,
      datasets: Object.entries(incidentTypeData).map(
        ([incidentType, data], index) => ({
          label: incidentType,
          data: allDates.map((date) => data[date] || 0),
          borderColor: COLORS[index % COLORS.length],
          backgroundColor: COLORS[index % COLORS.length] + "40",
          fill: false,
        })
      ),
    };

    // Calculate most common incident type
    const mostCommonIncidentType = Object.entries(typeCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );

    // Calculate top incident types
    const sortedIncidentTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => {
        const lastIncident = filtered
          .filter((incident) => incident.incidentType === type)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        return {
          type,
          count,
          lastOccurrence: lastIncident.timestamp,
          severity: lastIncident.severity,
          location: lastIncident.camera.location,
          cameraId: lastIncident.camera.cameraId,
          area: lastIncident.camera.areaName,
        };
      });

    return {
      filteredData: filtered,
      totalIncidents: filtered?.length,
      incidentTrendData,
      pieChartData,
      incidentTypeLineChartData,
      mostCommonIncidentType: {
        type: mostCommonIncidentType[0],
        count: mostCommonIncidentType[1],
      },
      topIncidentTypes: sortedIncidentTypes,
    };
  }, [incidentData, dateRange, selectedIncidentType]);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleIncidentTypeChange = useCallback((event) => {
    setSelectedIncidentType(event.target.value);
  }, []);

  const incidentsChartData = {
    datasets: [
      {
        label: "Incidents",
        data: incidentTrendData.map((item) => ({
          x: new Date(item.date),
          y: item.incidents,
        })),
      },
    ],
  };

  console.log("date range", selectedIncidentType);

  return (
    <Box
      sx={{
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: theme.palette.background.default,
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Analaytics
        </Typography>
        <Card>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <ButtonGroup
              variant="outlined"
              size="small"
              sx={{ mb: { xs: 2, md: 0 } }}
            >
              {["today", "weekly", "monthly"].map((range) => (
                <Button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  color={dateRange === range ? "primary" : "inherit"}
                  sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                >
                  {range}
                </Button>
              ))}
            </ButtonGroup>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Incident Type</InputLabel>
              <Select
                value={selectedIncidentType}
                onChange={handleIncidentTypeChange}
                label="Incident Type"
              >
                <MenuItem value="allIncidents">All Incidents</MenuItem>
                <MenuItem value="vehicleAndRoad">Vehicle and Road</MenuItem>
                <MenuItem value="municipal">Municipal</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Box>

      {/* Scrollable Content */}
      <Grid container spacing={2} gap={2} sx={{ mt: 2, mb: 2 }}>
        {/* Incident Trend Card */}
        <Grid item xs={12} md={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" color="textPrimary">
                  Incident Trend
                </Typography>
              </Box>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={350} />
              ) : incidentTrendData.length > 0 ? (
                <IncidentsChart
                  data={incidentsChartData}
                  xAxisFormatter={(value) => dayjs(value).format("MMM DD")}
                  xAxisTitle="Date"
                  yAxisTitle="Number of Incidents"
                />
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No trend data available for the selected period.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={12}
          gap={3}
          sx={{ display: "flex", flexDirection: "row" }}
        >
          {/* Left Column containing Incident Distribution and Total Incidents */}

          <Grid container direction="column" xs={12} md={6} spacing={2}>
            {/* Total Incidents */}
            <Grid item xs={12} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <ReportIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    color="textSecondary"
                  >
                    Total Incidents
                  </Typography>
                  {isLoading ? (
                    <Skeleton variant="rectangular" width={100} height={60} />
                  ) : (
                    <>
                      <Typography
                        component="p"
                        variant="h3"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {totalIncidents}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        align="center"
                        sx={{ mt: 2 }}
                      >
                        Most Common Type:
                      </Typography>
                      <Typography variant="h6" color="secondary" align="center">
                        {mostCommonIncidentType.type}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        align="center"
                      >
                        ({mostCommonIncidentType.count} incidents)
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Incident Distribution */}
            <Grid item xs={12} md={3}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PieChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography
                      variant="h6"
                      component="div"
                      color="textPrimary"
                    >
                      Incident Distribution
                    </Typography>
                  </Box>
                  {isLoading ? (
                    <Skeleton variant="circular" width={350} height={350} />
                  ) : pieChartData.length > 0 ? (
                    <PieChart
                      data={{
                        labels: pieChartData.map((item) => item.name),
                        datasets: [
                          {
                            data: pieChartData.map((item) => item.value),
                            backgroundColor: COLORS,
                          },
                        ],
                      }}
                    />
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      No distribution data available for the selected period.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* TopIncidentsList on the right */}
          <Grid item xs={12} md={6}>
            <TopIncidentsList data={topIncidentTypes} isLoading={isLoading} />
          </Grid>
        </Grid>

        {/* <Grid item xs={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" color="textPrimary">
                  Incident Types Over Time
                </Typography>
              </Box>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={350} />
              ) : incidentTypeLineChartData.datasets.length > 0 ? (
                <IncidentTypeLineChart data={incidentTypeLineChartData} />
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No incident type data available for the selected period.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid> */}

        <Grid item xs={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" color="textPrimary">
                  Detected vs Solved Analaytics
                </Typography>
              </Box>
              <CameraIncidentBarChart
                time={dateRange}
                incidentType={selectedIncidentType}
                selectedCamera={1}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" color="textPrimary">
                  Incident vs Area
                </Typography>
              </Box>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={350} />
              ) : incidentTypeLineChartData.datasets.length > 0 ? (
                // <ScatterPlot incidentsData={incidentData?.data} />
                <BubbleChart incidentsData={incidentData?.data} />
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No incident type data available for the selected period.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" color="textPrimary">
                  Time Area Chart
                </Typography>
              </Box>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={350} />
              ) : incidentTypeLineChartData.datasets.length > 0 ? (
                <TimeAreaChart incidentsData={incidentData?.data} />
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No incident type data available for the selected period.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
