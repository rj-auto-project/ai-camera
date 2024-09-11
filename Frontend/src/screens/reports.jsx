import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import dayjs from 'dayjs';
import { Chart as ChartJS, LineElement, PointElement,CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale,PointElement, LinearScale, Title, Tooltip, Legend);

// Simulated API response for incident types (specific)
const incidentTypesApi = [
  { id: 'crowdCount', label: 'Crowd Count' },
  { id: 'trafficViolations', label: 'Traffic Violations' },
  { id: 'vehicleRestriction', label: 'Vehicle Restriction' },
];

// Simulated API response for all-incident types (aggregate of all incidents)
const allIncidentDataApi = {
  today: [
    { x: '2024-09-11T01:00:00', crowdCount: 100, trafficViolations: 5, vehicleRestriction: 20 },
    { x: '2024-09-11T02:00:00', crowdCount: 150, trafficViolations: 3, vehicleRestriction: 15 },
    { x: '2024-09-11T03:00:00', crowdCount: 120, trafficViolations: 4, vehicleRestriction: 18 },
    // Add more data for today
  ],
  weekly: [
    { x: '2024-09-05', crowdCount: 500, trafficViolations: 25, vehicleRestriction: 80 },
    { x: '2024-09-06', crowdCount: 400, trafficViolations: 20, vehicleRestriction: 60 },
    { x: '2024-09-07', crowdCount: 300, trafficViolations: 15, vehicleRestriction: 50 },
    // Add more data for weekly
  ],
  monthly: [
    { x: '2024-08-15', crowdCount: 2000, trafficViolations: 100, vehicleRestriction: 300 },
    { x: '2024-08-16', crowdCount: 1800, trafficViolations: 90, vehicleRestriction: 270 },
    // Add more data for monthly
  ],
};

// Simulated API response for specific incident data
const incidentDataApi = {
  crowdCount: [
    { x: '2024-09-11T01:00:00', value: 100 },
    { x: '2024-09-11T02:00:00', value: 150 },
    { x: '2024-09-11T03:00:00', value: 120 },
  ],
  trafficViolations: [
    { x: '2024-09-11T01:00:00', value: 5 },
    { x: '2024-09-11T02:00:00', value: 3 },
    { x: '2024-09-11T03:00:00', value: 4 },
  ],
  vehicleRestriction: [
    { x: '2024-09-11T01:00:00', value: 20 },
    { x: '2024-09-11T02:00:00', value: 15 },
    { x: '2024-09-11T03:00:00', value: 18 },
  ],
};

export default function Reports() {
  const [dateRange, setDateRange] = useState('today');
  const [selectedIncidentType, setSelectedIncidentType] = useState('allIncidents');
  const [incidentData, setIncidentData] = useState(allIncidentDataApi[dateRange]);

  const handleIncidentTypeChange = (event) => {
    const type = event.target.value;
    setSelectedIncidentType(type);

    if (type === 'allIncidents') {
      setIncidentData(allIncidentDataApi[dateRange]);
    } else {
      setIncidentData(incidentDataApi[type]);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (selectedIncidentType === 'allIncidents') {
      setIncidentData(allIncidentDataApi[range]);
    } else {
      setIncidentData(incidentDataApi[selectedIncidentType]);
    }
  };

  // Customize the x-axis format based on the date range
  const getFormattedXAxisLabel = (xValue) => {
    if (dateRange === 'today') {
      return dayjs(xValue).format('h A'); // 12-hour format with AM/PM
    } else if (dateRange === 'weekly') {
      return `Day ${dayjs(xValue).day()}`; // Day 1, Day 2, etc.
    } else if (dateRange === 'monthly') {
      return `Day ${dayjs(xValue).date()}`; // Day 1 to Day 30/31
    }
    return xValue; // Default fallback
  };

  // Filter dataset by date range
  const filteredDataset = useMemo(() => {
    const now = dayjs();
    if (dateRange === 'today') {
      return incidentData.filter((item) => dayjs(item.x).isSame(now, 'day'));
    } else if (dateRange === 'weekly') {
      return incidentData.filter((item) => dayjs(item.x).isAfter(now.subtract(7, 'day')));
    } else if (dateRange === 'monthly') {
      return incidentData.filter((item) => dayjs(item.x).isAfter(now.subtract(1, 'month')));
    }
    return incidentData;
  }, [dateRange, incidentData]);

  const chartData = {
    labels: filteredDataset.map((data) => getFormattedXAxisLabel(data.x)),
    datasets: selectedIncidentType === 'allIncidents'
      ? [
          { label: 'Crowd Count', data: filteredDataset.map((data) => data.crowdCount), borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)', fill: false },
          { label: 'Traffic Violations', data: filteredDataset.map((data) => data.trafficViolations), borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: false },
          { label: 'Vehicle Restriction', data: filteredDataset.map((data) => data.vehicleRestriction), borderColor: 'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)', fill: false },
        ]
      : [
          { label: incidentTypesApi.find((t) => t.id === selectedIncidentType)?.label, data: filteredDataset.map((data) => data.value), borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)', fill: false },
        ],
  };

  return (
    <div>

      <ButtonGroup variant="contained">
        <Button onClick={() => handleDateRangeChange('today')}>Today</Button>
        <Button onClick={() => handleDateRangeChange('weekly')}>Weekly</Button>
        <Button onClick={() => handleDateRangeChange('monthly')}>Monthly</Button>
      </ButtonGroup>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="incident-type-label">Incident Type</InputLabel>
        <Select
          labelId="incident-type-label"
          value={selectedIncidentType}
          onChange={handleIncidentTypeChange}
        >
          <MenuItem value="allIncidents">All Incidents</MenuItem>
          {incidentTypesApi.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}`,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
              },
              ticks: {
                autoSkip: dateRange === 'today' ? true : false,
                maxRotation: 90,
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value',
              },
            },
          },
        }}
      />
    </div>
  );
}
