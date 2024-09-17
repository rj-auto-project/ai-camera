import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { format, subDays } from "date-fns";

// Mock camera data with incidentType attribute
// Extended mock camera data with daily resolved and unresolved issues
const mockCameraData = [
  {
    cameraIp: "192.168.1.1",
    cameraLocation: "Location A",
    camId: 1,
    solvedIssues: [
      {
        issueName: "Vehicle Accident",
        incidentType: "vehicleAndRoad",
        issueSolvedDate: "2024-09-10",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-17",
      },
      {
        issueName: "Vehicle Accident",
        incidentType: "vehicleAndRoad",
        issueSolvedDate: "2024-09-17",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-09",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-14",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-11",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-12",
      },
      // Additional solved issues for each day
      {
        issueName: "Traffic Congestion",
        incidentType: "vehicleAndRoad",
        issueSolvedDate: "2024-09-18",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-18",
      },
      {
        issueName: "Vehicle Accident",
        incidentType: "vehicleAndRoad",
        issueSolvedDate: "2024-09-19",
      },
      {
        issueName: "Pothole Repair",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-19",
      },
      {
        issueName: "Traffic Light Malfunction",
        incidentType: "vehicleAndRoad",
        issueSolvedDate: "2024-09-20",
      },
      {
        issueName: "Municipal Waste",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-20",
      },
      {
        issueName: "Traffic Violation",
        incidentType: "vehicleAndRoad",
        issueSolvedDate: "2024-09-21",
      },
      {
        issueName: "Pothole Repair",
        incidentType: "municipal",
        issueSolvedDate: "2024-09-21",
      },
    ],
    unsolvedIssues: [
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-09",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-17",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-14",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-11",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-12",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-10",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-17",
      },
      // Additional unresolved issues for each day
      {
        issueName: "Broken Sidewalk",
        incidentType: "municipal",
        issueDate: "2024-09-18",
      },
      {
        issueName: "Water Leakage",
        incidentType: "municipal",
        issueDate: "2024-09-18",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-19",
      },
      {
        issueName: "Garbage Overflow",
        incidentType: "municipal",
        issueDate: "2024-09-19",
      },
      {
        issueName: "Pothole",
        incidentType: "municipal",
        issueDate: "2024-09-20",
      },
      {
        issueName: "Traffic Violation",
        incidentType: "vehicleAndRoad",
        issueDate: "2024-09-20",
      },
      {
        issueName: "Streetlight Problem",
        incidentType: "municipal",
        issueDate: "2024-09-21",
      },
      {
        issueName: "Broken Sidewalk",
        incidentType: "municipal",
        issueDate: "2024-09-21",
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
  } else null;

  const filteredData = {
    solved: {},
    unsolved: {},
  };

  cameraData.solvedIssues.forEach((issue) => {
    const issueDate = new Date(issue.issueSolvedDate);

    if (
      issueDate >= dateLimit &&
      (incidentType === "allIncidents" || issue.incidentType === incidentType)
    ) {
      const formattedDate = format(issueDate, "yyyy-MM-dd");
      if (!filteredData.solved[formattedDate])
        filteredData.solved[formattedDate] = 0;
      filteredData.solved[formattedDate] += 1;
    }
  });

  cameraData.unsolvedIssues.forEach((issue) => {
    const issueDate = new Date(issue.issueDate);

    if (
      issueDate >= dateLimit &&
      (incidentType === "allIncidents" || issue.incidentType === incidentType)
    ) {
      const formattedDate = format(issueDate, "yyyy-MM-dd");
      if (!filteredData.unsolved[formattedDate])
        filteredData.unsolved[formattedDate] = 0;
      filteredData.unsolved[formattedDate] += 1;
    }
  });

  return filteredData;
};

export default function CameraIncidentBarChart({
  time,
  incidentType,
  selectedCamera,
}) {
  const [cameraData, setCameraData] = useState(null);
  const [chartData, setChartData] = useState({ solved: [], unsolved: [] });
  const [xLabels, setXLabels] = useState([]);

  // Fetch mock data based on selected camera (replace with API call later)
  useEffect(() => {
    const camera = mockCameraData.find((cam) => cam.camId === selectedCamera);
    if (camera) {
      setCameraData(camera);
    }
  }, [selectedCamera]);

  useEffect(() => {
    if (cameraData) {
      const processedData = processCameraData(cameraData, time, incidentType);

      const labels = Array.from(
        new Set([
          ...Object.keys(processedData.solved),
          ...Object.keys(processedData.unsolved),
        ])
      ).sort();
      const solvedData = labels.map((date) => processedData.solved[date] || 0);
      const unsolvedData = labels.map(
        (date) => processedData.unsolved[date] || 0
      );

      setXLabels(labels);
      setChartData({ solved: solvedData, unsolved: unsolvedData });
    }
  }, [cameraData, time, incidentType]);

  const getBarWidth = () => {
    const numBars = xLabels.length;
    return Math.max(10, 600 / numBars);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {cameraData ? (
        <>
          <h3>{`Camera at ${cameraData.cameraLocation}`}</h3>
          <BarChart
            width={1000}
            height={400}
            series={[
              {
                data: chartData.solved,
                label: "Solved Issues",
                id: "solvedId",
                barWidth: 1,
              },
              {
                data: chartData.unsolved,
                label: "Unsolved Issues",
                id: "unsolvedId",
                barWidth: getBarWidth(),
              },
            ]}
            xAxis={[{ data: xLabels, scaleType: "band" }]}
            yAxis={[{ title: "Number of Issues" }]}
          />
        </>
      ) : (
        <p>Select a camera to view the data</p>
      )}
    </div>
  );
}
