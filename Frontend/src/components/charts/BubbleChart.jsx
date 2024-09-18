import React from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  PointElement,
} from "chart.js";

// Register necessary chart components
ChartJS.register(Tooltip, Legend, Title, LinearScale, PointElement);

function convertData(incidents) {
  const areaMap = new Map();

  incidents.forEach((incident) => {
    const areaName = incident.camera.areaName;
    if (!areaMap.has(areaName)) {
      areaMap.set(areaName, { x: areaName, y: 0, r: 10, incidents: [] });
    }

    const areaData = areaMap.get(areaName);
    areaData.y++;
    areaData.r = Math.min(30, areaData.r + 2); // Increase radius, max 30

    areaData.incidents.push({
      cameraLocation: incident.camera.location,
      incidentType: incident.incidentType,
      incidentTime: new Date(incident.timestamp).toLocaleString(),
    });
  });

  return Array.from(areaMap.values());
}

const BubbleChart = ({ incidentsData }) => {
  // Sample data

  const formattedData = convertData(incidentsData);

  const data = {
    datasets: [
      {
        label: "Incidents",
        data: formattedData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Custom tooltip configuration
  const options = {
    scales: {
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Number of Incidents",
        },
      },
      x: {
        type: "category",
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
            return [
              `Total Incidents: ${data.y}`,
              "Incidents:",
              ...data.incidents.map(
                (incident) =>
                  `  Location: ${incident.cameraLocation}, Type: ${incident.incidentType}, Time: ${incident.incidentTime}`
              ),
            ];
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Bubble data={data} options={options} />
    </div>
  );
};

export default BubbleChart;
