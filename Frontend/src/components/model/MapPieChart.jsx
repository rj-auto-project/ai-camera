import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MapPieChart = ({ data }) => {
  const classColors = {
    "traffic-poles": "#FF5733",
    "electric-poles": "#FFD700",
    "telephone-poles": "#4169E1",
    "water-logging": "#1E90FF",
    "garbage": "#8B4513",
    "hoarding": "#9932CC",
    "public-toilets": "#2E8B57",
    "broken-drainage": "#4B0082",
    "fault-manholes": "#CD853F",
    "potholes": "#DC143C",
    "cracks": "#FF8C00",
    "broken-road-side": "#006400",
    "broken-divider": "#8B008B"
  };

  const processData = (inputData) => {
    const counts = {};
    inputData.forEach(item => {
      const className = item.className.toLowerCase();
      counts[className] = (counts[className] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: value,
      color: classColors[name] || '#888888'
    }));
  };

  const chartData = processData(data);

  return (
    <div className="absolute top-3 right-2 bg-transparent p-4 z-50" style={{ width: '500px', height: '300px', zIndex: 1300 }}>
      <h3 className="text-base font-semibold mb-1 text-center">Issue Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              
 
              const text = `${chartData[index].name} (${value})`;
              const textWidth = text.length * 5.5;
              const backgroundHeight = 16;
              const backgroundPadding = 4;
              
              return (
                <g>
                  {/* Black background rectangle */}
                  <rect
                    x={x > cx ? x - backgroundPadding : x - textWidth - backgroundPadding}
                    y={y - backgroundHeight/2}
                    width={textWidth + 2 * backgroundPadding}
                    height={backgroundHeight}
                    fill="rgba(0, 0, 0, 0.8)"
                    rx={4}
                    ry={4}
                  />
                  {/* White text */}
                  <text
                    x={x}
                    y={y}
                    fill="#FFFFFF"
                    fontSize="12px"
                    fontWeight="bold"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {text}
                  </text>
                </g>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
            itemStyle={{
              fontWeight: 'bold',
              color: '#333'
            }}
            formatter={(value, name) => [`${value} issues`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MapPieChart;