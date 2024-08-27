import fs from "fs";
import {
  suspectSearchService,
  anprOperationService,
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
    const {
      cameras,
      classes,
      startTime,
      endTime,
      top_color,
      bottom_color,
      isLive = false,
    } = req.body;
    const employeeId = req.userId;

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

    let currTime = new Date();
    let endtime = new Date(endTime);
    let starttime = new Date(startTime);

    // Live search operation
    if (isLive && currTime < endtime) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const liveSearch = async () => {
        while (currTime < endtime) {
          const liveResults = await suspectSearchService(
            cameras,
            classes,
            starttime,
            endTime,
            top_color,
            bottom_color,
            employeeId,
          );
          if (liveResults && liveResults.length > 0) {
            res.write(`data: ${JSON.stringify(liveResults)}\n\n`);
          }

          await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds

          // Update current time to continue searching until endTime
          currTime = new Date();
          starttime = new Date();
        }

        res.end(); // End the SSE stream when the loop ends
      };

      await liveSearch(); // Start the live search and wait until it finishes

      req.on("close", () => {
        console.log("Connection closed by client");
        res.end(); // End the SSE stream if the client closes the connection
      });

      return; // Ensure no further processing happens
    }

    // Non-live operation: Standard search (historical data)
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

const anprOperation = async (req, res) => {
  try {
    const { cameras, startTime, endTime, licensePlate, ownerName } = req.body;
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

    const results = await anprOperationService(
      cameras,
      startTime,
      endTime,
      licensePlate,
      employeeId,
      ownerName,
    );
    if (!results || results.length === 0) {
      return res.json({
        status: "ok",
        message: "No results found",
      });
    }

    return res.json({
      status: "ok",
      message: "ANPR operation completed successfully",
      results,
    });
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "ANPR operation failed",
      error: error.message,
    });
  }
};

export { suspectSearch, anprOperation };
