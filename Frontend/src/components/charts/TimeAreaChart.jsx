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
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(Tooltip, Legend, Title, LinearScale, PointElement, TimeScale);

function convertIncidentData(incidentData) {
  return incidentData.map((incident) => ({
    id: incident.id,
    timestamp: incident.timestamp,
    camera: {
      areaName: incident.camera.areaName,
      location: incident.camera.location,
    },
    incidentType: incident.incidentType,
  }));
}

function processIncidentData(incidentData) {
  const timeslots = [
    "00:00-01:59",
    "02:00-03:59",
    "04:00-05:59",
    "06:00-07:59",
    "08:00-09:59",
    "10:00-11:59",
    "12:00-13:59",
    "14:00-15:59",
    "16:00-17:59",
    "18:00-19:59",
    "20:00-21:59",
    "22:00-23:59",
  ];

  const chartData = [];

  // Aggregate incidents by timeslot
  const timeslotMap = new Map();

  incidentData.forEach((incident) => {
    const timestamp = new Date(incident.timestamp);
    const hour = timestamp.getHours();
    const timeslotIndex = Math.floor(hour / 2); // Group by 2-hour intervals
    const timeslot = timeslots[timeslotIndex];

    if (!timeslotMap.has(timeslot)) {
      timeslotMap.set(timeslot, []);
    }
    timeslotMap.get(timeslot).push(incident);
  });

  // Create chart data points
  timeslotMap.forEach((incidents, timeslot) => {
    const timeslotIndex = timeslots.indexOf(timeslot);
    chartData.push({
      x: timeslotIndex * 2, // Use hour as x-value for linear scale
      y: incidents.length, // Number of incidents in this timeslot
      r: Math.min(30, incidents.length * 2), // Adjust bubble radius based on incident count
      incidents: incidents.map((inc) => ({
        areaName: inc.camera.areaName,
        cameraLocation: inc.camera.location,
        incidentType: inc.incidentType,
        incidentTime: new Date(inc.timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  });

  return chartData;
}

const TimeAreaChart = ({ incidentsData }) => {
  const simplifiedData = convertIncidentData(incidentsData);
  const processedData = processIncidentData(simplifiedData);

  const data = {
    datasets: [
      {
        label: "Incidents",
        data: processedData,
        backgroundColor: "#00C9FF",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 24,
        title: {
          display: true,
          text: "Hour of Day",
          color: "rgba(255, 255, 255, 0.9)",
        },
        ticks: {
          stepSize: 2,
          callback: (value) => `${value}:00`,
          color: "rgba(255, 255, 255, 0.9)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Number of Incidents",
          color: "rgba(255, 255, 255, 0.9)",
        },
        ticks: {
          stepSize: 2,
          precision: 0,
          color: "rgba(255, 255, 255, 0.9)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = context.raw;
            const areaMap = new Map();

            // Group incidents by area
            data.incidents.forEach((incident) => {
              if (!areaMap.has(incident.areaName)) {
                areaMap.set(incident.areaName, []);
              }
              areaMap.get(incident.areaName).push(incident);
            });

            // Start tooltip with total incidents
            let tooltipText = [`Total Incidents: ${data.y}`];

            // Add each area with its incidents
            areaMap.forEach((incidents, areaName) => {
              tooltipText.push(`${areaName}:`);

              // Add each incident within the area
              incidents.forEach((incident) => {
                tooltipText.push(
                  `  • ${incident.incidentType} at ${incident.cameraLocation} (${incident.incidentTime})`,
                );
              });
            });

            return tooltipText;
          },
        },
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: "#1e1e1e", padding: "20px" }}>
      <Bubble data={data} options={options} />
    </div>
  );
};

export default TimeAreaChart;
