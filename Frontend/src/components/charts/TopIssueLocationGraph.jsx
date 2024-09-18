import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";

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
        alertCount: 2,
      },
      {
        issueId: 4,
        issueName: "Vehicle Accident",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-06",
        solvedDate: "2024-09-10",
        alertCount: 5,
      },
      {
        issueId: 3,
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueDate: "2024-09-04",
        solvedDate: "2024-09-05",
        alertCount: 2,
      },
      {
        issueId: 3,
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueDate: "2024-09-04",
        solvedDate: null,
        alertCount: 2,
      },
      {
        issueId: 5,
        issueName: "Pothole",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-06",
        solvedDate: null,
        alertCount: 3,
      },
      {
        issueId: 6,
        issueName: "Illegal Parking",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-08",
        solvedDate: null,
        alertCount: 7,
      },
      {
        issueId: 3,
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueDate: "2024-09-04",
        solvedDate: "2024-09-11",
        alertCount: 2,
      },
      {
        issueId: 3,
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueDate: "2024-09-04",
        solvedDate: "2024-09-11",
        alertCount: 2,
      },
      {
        issueId: 3,
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueDate: "2024-09-04",
        solvedDate: null,
        alertCount: 2,
      },
      {
        issueId: 4,
        issueName: "Vehicle Accident",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-06",
        solvedDate: "2024-09-13",
        alertCount: 5,
      },
      {
        issueId: 5,
        issueName: "Pothole",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-06",
        solvedDate: null,
        alertCount: 3,
      },
      {
        issueId: 6,
        issueName: "Illegal Parking",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-",
        solvedDate: null,
        alertCount: 7,
      },
    ],
  },
  {
    cameraIp: "192.168.1.2",
    cameraLocation: "Sindhi Camp",
    camId: 2,
    detectedIssues: [
      {
        issueId: 16,
        issueName: "Vehicle Breakdown",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-09",
        solvedDate: "2024-09-12",
        alertCount: 4,
      },
      {
        issueId: 17,
        issueName: "Power Outage",
        incidentType: "municipal",
        issueDate: "2024-09-10",
        solvedDate: null,
        alertCount: 1,
      },
      {
        issueId: 18,
        issueName: "Traffic Jam",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-10",
        solvedDate: "2024-09-14",
        alertCount: 6,
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
        alertCount: 4,
      },
      {
        issueId: 17,
        issueName: "Power Outage",
        incidentType: "municipal",
        issueDate: "2024-09-10",
        solvedDate: null,
        alertCount: 1,
      },
      {
        issueId: 18,
        issueName: "Traffic Jam",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-10",
        solvedDate: "2024-09-14",
        alertCount: 6,
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
        alertCount: 4,
      },
      {
        issueId: 17,
        issueName: "Power Outage",
        incidentType: "municipal",
        issueDate: "2024-09-10",
        solvedDate: null,
        alertCount: 1,
      },
      {
        issueId: 18,
        issueName: "Traffic Jam",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-10",
        solvedDate: "2024-09-14",
        alertCount: 6,
      },
    ],
  },
  {
    cameraIp: "192.168.1.3",
    cameraLocation: "MG Road",
    camId: 3,
    detectedIssues: [
      {
        issueId: 21,
        issueName: "Illegal Parking",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-11",
        solvedDate: null,
        alertCount: 3,
      },
      {
        issueId: 22,
        issueName: "Garbage Overflow",
        incidentType: "municipal",
        issueDate: "2024-09-12",
        solvedDate: "2024-09-15",
        alertCount: 2,
      },
    ],
  },
];

// Helper function to filter issues by date range
const filterByDateRange = (issues, timeRange) => {
  const today = dayjs();
  return issues.filter((issue) => {
    const issueDate = dayjs(issue.issueDate);

    switch (timeRange) {
      case "today":
        return issueDate.isSame(today, "day");
      case "weekly":
        return issueDate.isAfter(today.subtract(7, "day"));
      case "monthly":
        return issueDate.isAfter(today.subtract(30, "day"));
      default:
        return true;
    }
  });
};

// Helper function to filter issues by incident type
const filterByIncidentType = (issues, incidentType) => {
  if (!incidentType || incidentType === "allIncidents") {
    return issues; // Return all if no specific incident type is selected
  }
  return issues.filter((issue) => issue.incidentType === incidentType);
};

// Helper function to aggregate issues by location, solved/unsolved, and alert count
const aggregateIssuesByLocation = (data, timeRange, incidentType) => {
  const locationIssues = {};

  data.forEach((camera) => {
    const { cameraLocation, detectedIssues } = camera;

    // First, filter by date range
    const filteredIssuesByDate = filterByDateRange(detectedIssues, timeRange);

    // Then, filter by incident type
    const filteredIssues = filterByIncidentType(
      filteredIssuesByDate,
      incidentType
    );

    if (!locationIssues[cameraLocation]) {
      locationIssues[cameraLocation] = {
        solved: 0,
        unsolved: 0,
        alertCount: 0,
      };
    }

    if (detectedIssues)
      locationIssues[cameraLocation].unsolved = detectedIssues.length;

    filteredIssues.forEach((issue) => {
      if (issue.solvedDate) {
        locationIssues[cameraLocation].solved += 1;
      }
      locationIssues[cameraLocation].alertCount += issue.alertCount;
    });
  });

  // Sort locations by unsolved descending and solved ascending, then pick top 5
  const sortedLocations = Object.entries(locationIssues)
    .sort(([, a], [, b]) => b.unsolved - a.unsolved || a.solved - b.solved)
    .slice(0, 5);

  const labels = sortedLocations.map(([location]) => location);
  const solvedData = sortedLocations.map(([, issues]) => issues.solved);
  const unsolvedData = sortedLocations.map(([, issues]) => issues.unsolved);
  const alertCountData = sortedLocations.map(([, issues]) => issues.alertCount);

  return { labels, solvedData, unsolvedData, alertCountData };
};

export default function TopLocationIssueChart({ timeRange, incidentType }) {
  const [chartData, setChartData] = useState({
    solvedData: [],
    unsolvedData: [],
    alertCountData: [],
    labels: [],
  });

  useEffect(() => {
    const { labels, solvedData, unsolvedData, alertCountData } =
      aggregateIssuesByLocation(mockCameraData, timeRange, incidentType);
    setChartData({ solvedData, unsolvedData, alertCountData, labels });
  }, [timeRange, incidentType]);

  const getBarWidth = () => {
    const numBars = chartData.labels.length;
    return Math.max(10, 600 / numBars);
  };

  return (
    <div style={{ overflowX: "auto", position: "relative" }}>
      <BarChart
        xAxis={[
          { scaleType: "band", data: chartData.labels, label: "Location" },
        ]}
        series={[
          {
            data: chartData.unsolvedData,
            label: "Detected Issues",
            barThickness: getBarWidth(),
          },
          {
            data: chartData.solvedData,
            label: "Solved Issues",
            barThickness: getBarWidth(),
          },
          {
            data: chartData.alertCountData,
            label: "Alert Count",
            barThickness: getBarWidth(),
          },
        ]}
        width={600}
        height={400}
      />
    </div>
  );
}
