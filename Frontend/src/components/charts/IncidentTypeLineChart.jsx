import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const IncidentTypeLineChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
          color: "white", // This makes the legend labels white
        },
      },
      title: {
        display: true,
        text: "Incident Types Over Time",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
        color: "white", // This makes the title white
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "white", // This makes the x-axis title white
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "white", // This makes the x-axis labels white
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Incidents",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "white", // This makes the y-axis title white
        },
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "white", // This makes the y-axis labels white
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // This makes the y-axis grid lines slightly visible
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 3,
        hoverRadius: 6,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, `${dataset.borderColor}40`);
        gradient.addColorStop(1, `${dataset.borderColor}00`);
        return gradient;
      },
    })),
  };

  return <Line options={options} data={enhancedData} />;
};

export default IncidentTypeLineChart;
