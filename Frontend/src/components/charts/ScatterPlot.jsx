// ScatterPlot.js
import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale);

const ScatterPlot = ({
  title = "Number of Incidents vs Area",
  incidentsData,
}) => {
  console.log(incidentsData);

  // Prepare data for the scatter plot
  const areaIncidentDetails = {};

  incidentsData.forEach((incident) => {
    const areaName = incident.camera.areaName; // Get the area name from the incident data
    const timestamp = new Date(incident.timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }); // Format timestamp
    const cameraLocation = incident.camera.location; // Get camera location

    if (!areaIncidentDetails[areaName]) {
      areaIncidentDetails[areaName] = [];
    }
    areaIncidentDetails[areaName].push({
      timestamp,
      cameraLocation,
      incidentType: incident.incidentType,
    }); // Store incident details
  });

  const scatterData = Object.entries(areaIncidentDetails).map(
    ([areaName, incidents]) => ({
      x: areaName, // Area name for x-axis
      y: incidents.length, // Number of incidents for y-axis
      details: incidents, // Store incident details for tooltip
    })
  );

  const data = {
    datasets: [
      {
        label: "Incident Count by Area",
        data: scatterData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const { x, y, details } = tooltipItem.raw;
            const incidentDetails = details.map(
              (detail) =>
                `Type: ${detail.incidentType}, Location: ${detail.cameraLocation}, Time: ${detail.timestamp}`
            );

            return [`Area: ${x}`, `Incidents: ${y}`, ...incidentDetails];
          },
        },
      },
    },
    scales: {
      x: {
        type: "category", // Use category scale for x-axis with area names
        title: {
          display: true,
          text: "Area",
        },
      },
      y: {
        type: "linear", // Ensure y-axis is linear
        title: {
          display: true,
          text: "Number of Incidents",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limit the number of ticks displayed
        },
      },
    },
  };

  return (
    <div>
      <h2>{title}</h2>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScatterPlot;
