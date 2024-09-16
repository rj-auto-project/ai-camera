import prisma from "../../config/prismaClient.js";

const detectGarbageService = async () => {
  const classes = ["garbage", "pothole"];
  let results = await prisma.detectionLog.findMany({
    where: {
      detectionClass: {
        in: classes,
      },
    },
    include: {
      camera: true,
    },
    distinct: ["trackId"],
  });

  return results || [];
};

const getIncidentsService = async (dateRange) => {
  const whereClause = {};

  if (dateRange.startDate && dateRange.endDate) {
    whereClause.timestamp = {
      gte: dateRange.startDate,
      lte: dateRange.endDate,
    };
  }

  const incidents = await prisma.incidentLogs.findMany({
    where: whereClause,
    include: {
      camera: true,
    },
    distinct: ["trackId"],
  });

  // Process the incidents to get number of incidents per area and type
  const summary = incidents.reduce((acc, incident) => {
    const key = `${incident.incidentType}-${incident.camera.areaName}`;
    if (!acc[key]) {
      acc[key] = {
        incidentType: incident.incidentType,
        area: incident.camera.areaName,
        count: 0,
        time: incident.timestamp,
        cameras: [], // Initialize cameras as an empty array
      };
    }
    acc[key].count += 1;
    if (new Date(incident.timestamp) > new Date(acc[key].time)) {
      acc[key].time = incident.timestamp;
    }
    // Add camera details if not already included
    if (!acc[key].cameras.some(cam => cam.id === incident.camera.id)) {
      acc[key].cameras.push({
        id: incident.camera.id,
        location: incident.camera.location
      });
    }
    return acc;
  }, {});

  return Object.values(summary);
};

const getSpecificIncidentService = async (
  incidentType,
  startTime = "",
  endTime = ""
) => {
  const whereClause = {
    incidentType: incidentType,
  };

  if (startTime && endTime) {
    whereClause.timestamp = {
      gte: startTime,
      lte: endTime,
    };
  }

  const incidents = await prisma.incidentLogs.findMany({
    where: whereClause,
  });

  return incidents || [];
};

export {
  detectGarbageService,
  getIncidentsService,
  getSpecificIncidentService,
};
