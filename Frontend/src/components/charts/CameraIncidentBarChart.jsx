import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, subDays } from "date-fns";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// Mock camera data with detected and solved issues
// Mock camera data with detected and solved issues
const mockCameraData = [
  {
    cameraIp: "192.168.1.1",
    cameraLocation: "Lal Kothi",
    camId: 1,
    detectedIssues: [
      {
        issueId: 3,
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueDate: "2024-09-04",
        solvedDate: "2024-09-05",
      },
      {
        issueId: 4,
        issueName: "Vehicle Accident",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-06",
        solvedDate: "2024-09-10",
      },
      {
        issueId: 5,
        issueName: "Pothole",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-06",
        solvedDate:null,
      },
      {
        issueId: 6,
        issueName: "Illegal Parking",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-08",
        solvedDate: null,
      },
      {
        issueId: 6,
        issueName: "Illegal Parking",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-09",
        solvedDate: null,
      },
    ],
  },
  {
    cameraIp: "192.168.1.2",
    cameraLocation: "Civil Lines",
    camId: 2,
    detectedIssues: [
      {
        issueId: 16,
        issueName: "Vehicle Breakdown",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-09",
        solvedDate: "2024-09-12",
      },
      {
        issueId: 17,
        issueName: "Power Outage",
        incidentType: "municipal",
        issueDate: "2024-09-10",
        solvedDate: null,
      },
      {
        issueId: 18,
        issueName: "Traffic Jam",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-10",
        solvedDate: "2024-09-14",
      },
      {
        issueId: 19,
        issueName: "Fire Hazard",
        incidentType: "emergency",
        issueDate: "2024-09-10",
        solvedDate: "2024-09-16",
      },
      {
        issueId: 20,
        issueName: "Flooding",
        incidentType: "municipal",
        issueDate: "2024-09-14",
        solvedDate: null,
      },
    ],
  },
];

const processCameraData = (cameraData, time, incidentType) => {
  const now = new Date();
  let dateLimit;

  if (time === "weekly") {
    dateLimit = subDays(now, 6);
  } else if (time === "monthly") {
    dateLimit = subDays(now, 30);
  }

  const filteredData = {
    detected: {},
    solved: {},
  };

  cameraData.detectedIssues.forEach((issue) => {
    const issueDate = new Date(issue.issueDate);
    const solvedDate = issue.solvedDate ? new Date(issue.solvedDate) : null;

    if (
      issueDate >= dateLimit &&
      (incidentType === "allIncidents" || issue.incidentType === incidentType)
    ) {
      const formattedIssueDate = format(issueDate, "yyyy-MM-dd");
      if (!filteredData.detected[formattedIssueDate])
        filteredData.detected[formattedIssueDate] = 0;
      filteredData.detected[formattedIssueDate] += 1;

  
      if (solvedDate) {
        if (!filteredData.solved[formattedIssueDate])
          filteredData.solved[formattedIssueDate] = 0;
        filteredData.solved[formattedIssueDate] += 1;
      }
    }
  });

  return filteredData;
};

export default function CameraIncidentBarChart({ time, incidentType }) {
  const [selectedLocation, setSelectedLocation] = useState(
    mockCameraData[0]?.cameraLocation || ""
  );
  const [cameraData, setCameraData] = useState(mockCameraData[0] || null);
  const [chartData, setChartData] = useState({ detected: [], solved: [] });
  const [xLabels, setXLabels] = useState([]);

  // Fetch mock data based on selected location
  useEffect(() => {
    if (selectedLocation) {
      const camera = mockCameraData.find(
        (cam) => cam.cameraLocation === selectedLocation
      );
      if (camera) {
        setCameraData(camera);
      }
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (cameraData) {
      const processedData = processCameraData(cameraData, time, incidentType);

      const labels = Array.from(
        new Set([
          ...Object.keys(processedData.detected),
          ...Object.keys(processedData.solved),
        ])
      ).sort();
      const detectedData = labels.map(
        (date) => processedData.detected[date] || 0
      );
      const solvedData = labels.map((date) => processedData.solved[date] || 0);
      console.log("solved data: ", processedData);
      setXLabels(labels);
      setChartData({ detected: detectedData, solved: solvedData });
    }
  }, [cameraData, time, incidentType]);

  const getBarWidth = () => {
    const numBars = xLabels.length;
    return Math.max(10, 600 / numBars);
  };

  // Get unique locations from the mock data
  const locations = Array.from(
    new Set(mockCameraData.map((camera) => camera.cameraLocation))
  );

  return (
    <div style={{ overflowX: "auto", position: "relative" }}>
      <FormControl
        size="small"
        variant="outlined"
        style={{ position: "absolute", right: 10, top: 10, minWidth: 200 }}
      >
        <InputLabel id="location-select-label">Select Location</InputLabel>
        <Select
          labelId="location-select-label"
          id="locationSelect"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((location, index) => (
            <MenuItem key={index} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <BarChart
        xAxis={[{ scaleType: "band", data: xLabels, label: "Date" }]}
        series={[
          {
            data: chartData.detected,
            label: "Detected Issues",
            barThickness: getBarWidth(),
          },
          {
            data: chartData.solved,
            label: "Solved Issues",
            barThickness: getBarWidth(),
          },
        ]}
        width={600}
        height={400}
      />
    </div>
  );
}
