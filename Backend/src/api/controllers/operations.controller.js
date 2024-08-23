import fs from "fs";
import {
  suspectSearchService,
  getClasses,
} from "../services/operations.service.js";
import prisma from "../../config/prismaClient.js";

// to be done
// const faceDetection = async (req, res) => {
//   try {
//     const files = req.files;
//     if (!files || files.length === 0) {
//       return res
//         .status(400)
//         .json({ status: "fail", message: "No images uploaded" });
//     }

//     const result = await Promise.all(
//       files.map(async (file) => {
//         try {
//           const matchingImage = await faceDetection(file.path);
//           fs.unlinkSync(file.path);
//           return {
//             file: file.originalname,
//             matchingImage,
//           };
//         } catch (error) {
//           console.error("Error detecting face:", error);
//           return {
//             status: "fail",
//             message: "Face detection failed",
//             error: error.message,
//           };
//         }
//       })
//     );

//     res.json({
//       status: "ok",
//       message: "Face detection completed successfully",
//       result,
//     });
//   } catch (error) {
//     console.error("Error performing operation:", error);
//     res.status(500).json({
//       status: "fail",
//       message: "Face detection failed",
//       error: error.message,
//     });
//   }
// };

const suspectSearch = async (req, res) => {
  try {
    const { cameras, classes, startTime, endTime, top_color, bottom_color } =
      req.body;
    const employeeId = req.userId;
    console.log("Employee ID:", employeeId);
    if (!employeeId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized access",
      });
    }

    // Ensure the required fields are provided
    if (!cameras || !classes || !startTime || !endTime) {
      return res.status(400).json({
        status: "fail",
        message:
          "Missing required fields: cameras, classes, startTime, and endTime are required.",
      });
    }

    const results = await suspectSearchService(
      cameras,
      classes,
      startTime,
      endTime,
      top_color,
      bottom_color,
      employeeId,
    );

    if (!results || results.length === 0) {
      return res.json({
        status: "ok",
        message: "No results found",
      });
    }
    return res.json({
      status: "ok",
      message: "Suspect search completed successfully",
      results,
    });
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "Suspect search failed",
      error: error.message,
    });
  }
};

const getClassList = async (req, res) => {
  try {
    const { objectType } = req.query;
    if (objectType) {
      const classes = await getClasses(objectType);
      if (!classes || classes.length === 0) {
        return res.json({
          status: "fail",
          message: "No classes found",
        });
      }
      return res.json({
        status: "ok",
        message: "Classes fetched successfully",
        classes,
      });
    } else {
      const classes = await getClasses();
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

const anprOperation = async (req, res) => {
  try {
    const {
      cameras,
      startTime,
      endTime,
      licensePlate,
      vehicleClass,
      topColor,
      bottomColor = topColor,
    } = req.body;
    const employeeId = req.userId;
    if (!employeeId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized access",
      });
    }

    if (!cameras || cameras.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No cameras provided",
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        status: "fail",
        message: "Start and end time are required",
      });
    }

    if (!vehicleClass || !topColor || !bottomColor) {
      return res.status(400).json({
        status: "fail",
        message: "Vehicle class, top color, and bottom color are required",
      });
    }
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "ANPR operation failed",
      error: error.message,
    });
  }
};

export { getClassList, suspectSearch, anprOperation };
