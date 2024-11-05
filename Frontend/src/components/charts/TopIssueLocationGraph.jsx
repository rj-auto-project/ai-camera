import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchDetectedVsSolved } from "../../api/hooks/useFetchIncidents";

// Helper function to filter issues by incident type
const filterByIncidentType = (issues, incidentType) => {
  if (!Array.isArray(issues)) return [];
  if (!incidentType || incidentType === "allIncidents") {
    return issues;
  }
  return issues.filter((issue) => issue.incidentType === incidentType);
};

// Helper function to aggregate issues by location, solved/unsolved, and alert count
const aggregateIssuesByLocation = (data, incidentType) => {
  if (!Array.isArray(data)) {
    console.error("Expected data to be an array, received:", typeof data);
    return [];
  }

  const locationIssues = {};

  data.forEach((camera) => {
    const { cameraLocation, detectedIssues } = camera;

    if (!cameraLocation) {
      console.warn("Camera location is undefined for an item:", camera);
      return;
    }

    // Filter by incident type
    const filteredIssues = filterByIncidentType(detectedIssues, incidentType);

    if (!locationIssues[cameraLocation]) {
      locationIssues[cameraLocation] = {
        solved: 0,
        unsolved: 0,
        alertCount: 0,
      };
    }

    filteredIssues.forEach((issue) => {
      if (issue.solvedDate) {
        locationIssues[cameraLocation].solved += 1;
      } else {
        locationIssues[cameraLocation].unsolved += 1;
      }
      locationIssues[cameraLocation].alertCount += issue.alertCount || 0;
    });
  });

  // Sort locations by unsolved descending and solved ascending, then pick top 5
  const sortedLocations = Object.entries(locationIssues)
    .sort(([, a], [, b]) => b.unsolved - a.unsolved || a.solved - b.solved)
    .slice(0, 5);

  return sortedLocations.map(([location, issues]) => ({
    location,
    solved: issues.solved,
    unsolved: issues.unsolved,
    alertCount: issues.alertCount,
  }));
};

export default function TopLocationIssueChart({ timeRange, incidentType }) {
  const [chartData, setChartData] = useState([]);
  const { data: incidentsData, isLoading, error } = useFetchDetectedVsSolved(timeRange);

  useEffect(() => {
    if (incidentsData) {
      console.log("Received data:", incidentsData);
      const processedData = aggregateIssuesByLocation(incidentsData, incidentType);
      console.log("Processed data:", processedData);
      setChartData(processedData);
    }
  }, [incidentsData, incidentType]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!chartData || chartData.length === 0) return <div>No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="unsolved" fill="#8884d8" name="Unsolved Issues" barSize={20}/>
        <Bar dataKey="solved" fill="#82ca9d" name="Solved Issues" barSize={20}/>
        <Bar dataKey="alertCount" fill="#ffc658" name="Alert Count" barSize={20}/>
      </BarChart>
    </ResponsiveContainer>
  );
}