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

const getIncidentsService = async (startTime = "", endTime = "") => {
  const whereClause = {};

  if (startTime && endTime) {
    whereClause.timestamp = {
      gte: startTime,
      lte: endTime,
    };
  }

  const incidents = await prisma.incidentLogs.findMany({
    where: whereClause,
    include: {
      camera: true,
    },
    orderBy: {
      timestamp: "desc",
    },
    distinct: ["trackId"],
  });

  return incidents || [];
};

const getPaginatedIncidentsService = async (
  offset,
  limit,
  filters = {},
  sortCondition = { timestamp: "desc" }
) => {
  // Find incidents with filters, sorting, pagination, and distinct trackId
  const incidents = await prisma.incidentLogs.findMany({
    skip: offset,
    take: limit,
    where: {
      ...filters, // Apply the filters (incidentType, cameraId, modelResolved, etc.)
    },
    include: {
      camera: true, // Include related camera data
    },
    orderBy: sortCondition, // Apply sorting conditions
    distinct: ["trackId"], // Distinct by trackId
  });

  // Count total incidents matching the filters
  const totalIncidents = await prisma.incidentLogs.count({
    where: {
      ...filters, // Apply the filters to the count query as well
    },
  });

  const incidentsTypes = await prisma.incidentLogs.findMany({
    select: {
      incidentType: true,
    },
    distinct: ["incidentType"],
  });

  const cameras = [
    ...new Set(incidents.map((incident) => incident?.camera?.cameraId)),
  ];

  return (
    { incidents, totalIncidents, incidentsTypes, cameras } || {
      incidents: [],
      totalIncidents: 0,
      incidentsTypes: [],
      cameras: [],
    }
  );
};

const getSpecificIncidentService = async (
  incidentType,
  startTime = "",
  endTime = "",
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
  getPaginatedIncidentsService,
};
