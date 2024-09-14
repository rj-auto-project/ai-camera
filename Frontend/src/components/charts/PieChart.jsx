import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const frameDuration = 1000 / 60; // 60 fps
    const totalFrames = Math.round(animationDuration / frameDuration);

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setAnimationProgress(progress);

      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc, curr) => acc + curr,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    layout: {
      padding: 20,
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000, // 1 second
      easing: "easeOutQuart",
    },
  };

  const animatedData = {
    ...data,
    datasets: data?.datasets?.map((dataset) => ({
      ...dataset,
      data: dataset?.data?.map((value) => value * animationProgress),
    })),
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {data && data.datasets ? (
        <Pie data={animatedData} options={options} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default PieChart;
