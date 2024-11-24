import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SurveyScatterPlot = ({
  data = [],
  backgroundColor = "#111827",
  textColor = "#e5e7eb",
}) => {
  const transformedData = data.map((item, index) => {
    return item.distances.map((distance) => ({
      class: item.class,
      distance: distance,
      yAxis: data.length - 1 - index,
    }));
  });

  const maxDistance = Math.max(...data.flatMap((item) => item.distances));

  console.log("max", maxDistance);

  return (
    <div
      className="w-full h-screen"
      style={{ backgroundColor, color: textColor }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 50, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            dataKey="distance"
            name="Distance"
            label={{
              value: `Distance (${maxDistance >= 1 ? "km" : "m"})`,
              position: "bottom",
              fill: textColor,
              offset: 50,
            }}
            domain={[0, maxDistance]}
            tick={{ fill: textColor }}
            stroke={textColor}
          />
          <YAxis
            type="number"
            dataKey="yAxis"
            width={120}
            domain={[-1, data.length]}
            ticks={[...Array(data.length).keys()]}
            tickFormatter={(value) =>
              data[data.length - 1 - value]?.class || ""
            }
            tick={{ fill: textColor }}
            stroke={textColor}
          />
          <Tooltip
            contentStyle={{
              backgroundColor:
                backgroundColor === "#111827" ? "#333" : backgroundColor,
              border: "1px solid #666",
            }}
            itemStyle={{ color: textColor }}
            formatter={(value, name, props) => {
              if (name === "Distance") return `${value} km`;
              return props.payload.class;
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: textColor }}>{value}</span>
            )}
          />
          {data.map((item) => (
            <Scatter
              key={item.class}
              name={item.class}
              data={transformedData
                .flat()
                .filter((d) => d.class === item.class)}
              fill={item.color}
              line={false}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SurveyScatterPlot;
