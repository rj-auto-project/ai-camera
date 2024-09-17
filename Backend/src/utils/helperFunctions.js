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

export { getObjectTypes, getClassList, formatTimestamp, getDateRange };
