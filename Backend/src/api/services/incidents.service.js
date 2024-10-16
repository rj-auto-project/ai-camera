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

const getPaginatedIncidentsService = async (offset, limit) => {
  const incidents = await prisma.incidentLogs.findMany({
    skip: offset,
    take: limit,
    include: {
      camera: true,
    },
    orderBy: {
      timestamp: "desc",
    },
    distinct: ["trackId"],
  });
  const totalIncidents = await prisma.incidentLogs.count();

  return { incidents, totalIncidents } || { incidents: [], totalIncidents: 0 };
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
  getPaginatedIncidentsService,
};
