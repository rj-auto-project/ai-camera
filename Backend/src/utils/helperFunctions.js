import prisma from "../config/prismaClient.js";
import moment from "moment";

const getObjectTypes = async (req, res) => {
  const distinctObjectTypes = await prisma.class.findMany({
    distinct: ["objectType"],
    select: {
      objectType: true,
    },
  });
  res.json({ objectTypes: distinctObjectTypes });
};

const getClassList = async (req, res) => {
  try {
    const { objectType } = req.query;
    if (objectType) {
      const classes = await prisma.class.findMany({
        where: {
          objectType,
        },
      });
      if (!classes) {
        return res.status(404).json({
          status: "fail",
          message: "No classes found for the specified objectType",
        });
      }
      return res.json({
        status: "ok",
        message: "Classes fetched successfully",
        classes,
      });
    } else {
      const classes = await prisma.class.findMany();
      if (!classes) {
        return res.status(404).json({
          status: "fail",
          message: "No classes found",
        });
      }
      return res.json({
        status: "ok",
        message: "Classes fetched successfully",
        classes,
      });
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

const formatTimestamp = (timestamp) => {
  const dateObj = new Date(timestamp);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const formattedTime = `${hours}-00-00`;

  const formattedDate = `${year}-${month}-${day}`;

  return { datefolder: formattedDate, videotime: formattedTime };
};

const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case "today":
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;
    case "weekly":
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
      break;
    case "monthly":
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
      break;
    case "yearly":
      startDate = moment().startOf("year").toDate();
      endDate = moment().endOf("year").toDate();
      break;
    default:
      throw new Error("Invalid period");
  }

  return { startDate, endDate };
};

const formatIncidentData = (incidents) => {
  const cameraDataMap = {};

  incidents.forEach((incident) => {
    const { camera } = incident;
    if (!cameraDataMap[camera.cameraId]) {
      cameraDataMap[camera.cameraId] = {
        cameraLocation: camera.location,
        camId: camera.cameraId,
        detectedIssues: [],
      };
    }

    cameraDataMap[camera.cameraId].detectedIssues.push({
      issueId: incident.id,
      incidentType: mapIncidentType(incident.incidentType),
      issueDate: incident.timestamp.toISOString().split("T")[0],
      solvedDate: incident.resolvedAt
        ? incident.resolvedAt.toISOString().split("T")[0]
        : null,
      alertCount: incident.alerts,
    });
  });

  return Object.values(cameraDataMap);
};

const mapIncidentType = (type) => {
  switch (type) {
    case "GARBAGE":
    case "POTHOLE":
    case "GARBAGE_LITTERING":
    case "CATTLE":
    case "WATERLOGGING":
    case "PEEING":
    case "SPITTING":
      return "municipal";
    case "REDLIGHT_VIOLATION":
    case "OVERSPEEDING":
    case "ILLEGAL_PARKING":
    case "WRONG_WAY_DRIVING":
    case "ACCIDENT":
    case "VEHICLE_RESTRICTION":
    case "CROWD_RESTRICTION":
      return "vehicleAndRoad";
    default:
      return "other";
  }
};

export {
  getObjectTypes,
  getClassList,
  formatTimestamp,
  getDateRange,
  formatIncidentData,
};
