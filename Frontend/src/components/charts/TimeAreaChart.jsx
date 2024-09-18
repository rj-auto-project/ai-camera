import React from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  PointElement,
  TimeScale,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Register necessary chart components
ChartJS.register(
  Tooltip,
  Legend,
  Title,
  LinearScale,
  PointElement,
  TimeScale,
  CategoryScale
);

const TimeAreaChart = () => {
  // Expanded sample data with last incident time for each entry
  const data = {
    datasets: [
      {
        label: "Incidents",
        data: [
          {
            x: "2024-09-17T08:55:00", // Last incident time for Area 1
            y: "Area 1",
            r: 2,
            count: 5,
            incidents: [
              {
                cameraLocation: "Area 1(A)",
                incidentType: "Type A",
                incidentTime: "08:30 AM",
              },
              {
                cameraLocation: "Area 1(B)",
                incidentType: "Type B",
                incidentTime: "08:32 AM",
              },
              {
                cameraLocation: "Area 1(C)",
                incidentType: "Type C",
                incidentTime: "08:35 AM",
              },
              {
                cameraLocation: "Area 1(D)",
                incidentType: "Type D",
                incidentTime: "08:38 AM",
              },
              {
                cameraLocation: "Area 1(E)",
                incidentType: "Type E",
                incidentTime: "08:55 AM",
              }, // Last incident
            ],
          },
          {
            x: "2024-09-17T09:55:00", // Last incident time for Area 2
            y: "Area 2",
            r: 3,
            count: 3,
            incidents: [
              {
                cameraLocation: "Area 2(A)",
                incidentType: "Type A",
                incidentTime: "09:45 AM",
              },
              {
                cameraLocation: "Area 2(B)",
                incidentType: "Type B",
                incidentTime: "09:50 AM",
              },
              {
                cameraLocation: "Area 2(C)",
                incidentType: "Type C",
                incidentTime: "09:55 AM",
              }, // Last incident
            ],
          },
          {
            x: "2024-09-17T10:22:00", // Last incident time for Area 3
            y: "Area 3",
            r: 4,
            count: 4,
            incidents: [
              {
                cameraLocation: "Area 3(A)",
                incidentType: "Type D",
                incidentTime: "10:15 AM",
              },
              {
                cameraLocation: "Area 3(B)",
                incidentType: "Type E",
                incidentTime: "10:18 AM",
              },
              {
                cameraLocation: "Area 3(C)",
                incidentType: "Type A",
                incidentTime: "10:20 AM",
              },
              {
                cameraLocation: "Area 3(D)",
                incidentType: "Type B",
                incidentTime: "10:22 AM",
              }, // Last incident
            ],
          },
          {
            x: "2024-09-17T11:35:00", // Last incident time for Area 1 again
            y: "Area 1",
            r: 2,
            count: 2,
            incidents: [
              {
                cameraLocation: "Area 1(A)",
                incidentType: "Type C",
                incidentTime: "11:30 AM",
              },
              {
                cameraLocation: "Area 1(B)",
                incidentType: "Type D",
                incidentTime: "11:35 AM",
              }, // Last incident
            ],
          },
        ],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const areas = [...new Set(data.datasets[0].data.map((item) => item.y))];

  // Custom tooltip configuration and chart options
  const options = {
    scales: {
      
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "h:mm a",
          displayFormats: {
            hour: "h:mm a",
          },
        },
        title: {
          display: true,
          text: "Time of Day (Last Incident Logged)",
        },
      },
      y: {
        type: "category", // Use categorical scale for areas
        labels: areas,
        title: {
          display: true,
          text: "Area",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = context.raw;
            const incidentList = data.incidents.map(
              (incident) =>
                `• ${incident.incidentType} at ${incident.incidentTime}`
            );
            return [
              `Camera Location: ${data.y}`,
              `Total Incidents: ${data.count}`,
              ...incidentList,
            ];
          },
        },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Bubble data={data} options={options} />
    </div>
  );
};

export default TimeAreaChart;
