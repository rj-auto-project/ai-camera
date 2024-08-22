import fs from "fs";
import {
  faceDetectionService,
  suspectSearchService,
  getClasses,
} from "../services/operations.service.js";
import prisma from "../../config/prismaClient.js";

const faceDetection = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "No images uploaded" });
    }

    const result = await Promise.all(
      files.map(async (file) => {
        try {
          const matchingImage = await faceDetection(file.path);
          fs.unlinkSync(file.path);
          return {
            file: file.originalname,
            matchingImage,
          };
        } catch (error) {
          console.error("Error detecting face:", error);
          return {
            status: "fail",
            message: "Face detection failed",
            error: error.message,
          };
        }
      }),
    );

    res.json({
      status: "ok",
      message: "Face detection completed successfully",
      result,
    });
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "Face detection failed",
      error: error.message,
    });
  }
};

const suspectSearch = async (req, res) => {
  try {
    const { cameras, classes, startTime, endTime, top_color, bottom_color } =
      req.body;

    // Ensure the required fields are provided
    if (!cameras || !classes || !startTime || !endTime) {
      return res.status(400).json({
        status: "fail",
        message:
          "Missing required fields: cameras, classes, startTime, and endTime are required.",
      });
    }

    // Convert startTime and endTime to ISO-8601 Date strings
    const start_time = new Date(startTime).toISOString();
    const end_time = new Date(endTime).toISOString();

    // Check if the dates are valid
    if (isNaN(new Date(start_time)) || isNaN(new Date(end_time))) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid date format provided.",
      });
    }

    // Perform the search in the DetectionLog model
    const results = await prisma.detectionLog.findMany({
      where: {
        OR: [
          {
            metadata: {
              path: ["top"],
              equals: top_color, // Use topColor from req.body
            },
          },
          {
            metadata: {
              path: ["bottom"],
              equals: bottom_color, // Use bottomColor from req.body
            },
          },
        ],
        AND: [
          {
            cameraId: {
              in: cameras, // Use cameraIds array from req.body
            },
          },
          {
            timestamp: {
              gte: new Date(startTime), // Start time from req.body
              lte: new Date(endTime), // End time from req.body
            },
          },
          {
            detectionClass: {
              in: classes,
            },
          },
        ],
      },
      distinct: ["trackId"],
    });

    // Handle case where no results are found
    if (!results || results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No results found",
      });
    }

    // Send the response with the search results
    res.status(200).json({
      status: "success",
      data: results,
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

export { getClassList, suspectSearch };
