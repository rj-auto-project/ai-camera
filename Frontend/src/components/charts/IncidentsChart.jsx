import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Paper } from "@mui/material";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const IncidentsChart = ({ data, xAxisFormatter, xAxisTitle, yAxisTitle }) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            weight: "bold",
          },
          color: theme.palette.text.primary,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: false, // We'll use a custom title outside the chart
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 14,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: xAxisTitle === "Time" ? "hour" : "day",
          displayFormats: {
            hour: "HH:mm",
            day: "MMM dd",
          },
        },
        title: {
          display: true,
          text: xAxisTitle,
          font: {
            size: 12,
            weight: "bold",
          },
          color: theme.palette.text.secondary,
        },
        ticks: {
          callback: xAxisFormatter,
          color: theme.palette.text.secondary,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisTitle,
          font: {
            size: 12,
            weight: "bold",
          },
          color: theme.palette.text.secondary,
        },
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.secondary,
          padding: 10,
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5,
      },
    },
  };

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
      fill: false,
      pointBackgroundColor: theme.palette.primary.main,
      pointBorderColor: theme.palette.background.paper,
      pointHoverBackgroundColor: theme.palette.primary.light,
      pointHoverBorderColor: theme.palette.primary.dark,
    })),
  };

  return (
    <Paper elevation={1} sx={{  height: "100%" }}>
      <Box sx={{ height: 400, width: "100%"}}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default IncidentsChart;
