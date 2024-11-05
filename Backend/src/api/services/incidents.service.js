import prisma from "../../config/prismaClient.js";
import { formatIncidentData } from "../../utils/helperFunctions.js";

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
      wrongDetection: false,
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
      wrongDetection: false,
      ...filters, // Apply the filters to the count query as well
    },
  });

  const incidentsTypes = await prisma.incidentLogs.findMany({
    select: {
      incidentType: true,
    },
    distinct: ["incidentType"],
  });

  const cameras = await prisma.camera.findMany({
    distinct: ["cameraId"],
  });

  return (
    { incidents, totalIncidents, incidentsTypes, cameras } || {
      incidents: [],
      totalIncidents: 0,
      incidentsTypes: [],
      cameras: [],
    }
  );
};

const markWrongOrRight = async (id, mark) => {
  const incident = await prisma.incidentLogs.update({
    where: {
      id: id,
    },
    data: {
      wrongDetection: mark,
    },
  });
  return true || false;
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

const getGraphIncidents = async (timeframe) => {
  try {
    const now = new Date();
    let startDate;
    if (timeframe === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeframe === 'weekly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); 
    } else if (timeframe === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      throw new Error("Invalid timeframe specified.");
    }
    const incidents = await prisma.incidentLogs.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      include: {
        camera: true,
      },
    });

    return formatIncidentData(incidents);
  } catch (error) {
    throw new Error("Failed to fetch incidents from database: " + error.message);
  }
};

export {
  detectGarbageService,
  getIncidentsService,
  getSpecificIncidentService,
  getPaginatedIncidentsService,
  markWrongOrRight,
  getGraphIncidents
};
