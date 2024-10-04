import {
  suspectSearchService,
  getOperationsService,
  vehicleOperationService,
  incidentsSearchService,
} from "../services/operations.service.js";
import prisma from "../../config/prismaClient.js";

import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import redisClient from "../../config/redisClient.js";

// Resolve __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Ensure the required fields are provided
    if (!startTime || !endTime) {
      return res.status(400).json({
        status: "fail",
        message:
          "Missing required fields: cameras, classes, startTime, endTime are required.",
      });
    }

    if (!classes || classes.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "At least one class is required",
      });
    }

    if (!top_color || !bottom_color) {
      return res.status(400).json({
        status: "fail",
        message: "At least one color is required",
      });
    }

    if (top_color && !bottom_color) bottom_color = top_color;
    if (!top_color && bottom_color) top_color = bottom_color;

    // Get cameras' details involved in the operation
    const camerasEngagedInOperation = await prisma.camera.findMany({
      where: {
        cameraId: typeof cameras === "string" ? cameras : { in: cameras },
      },
      select: {
        cameraIp: true,
        cameraId: true,
        location: true,
      },
    });

    // Log this operation
    const newOperation = await prisma.operationLog.create({
      data: {
        operationType: "SUSPECT SEARCH",
        cameras: {
          connect: camerasEngagedInOperation.map((camera) => ({
            cameraId: camera?.cameraId,
          })),
        },
        operationRequestData: {
          classes,
          top_color,
          bottom_color,
        },
        initialTimestamp: new Date(startTime),
        finalTimestamp: new Date(endTime),
        userId: employeeId,
      },
    });

    //live operations
    const currTime = new Date();
    const endtime = new Date(endTime);

    if (currTime < endtime) {
      // Send response indicating SSE has been triggered
      return res.json({
        status: "ok",
        message: "Suspect search live operation initiated",
        operationId: newOperation.id, // Return the operation ID for SSE
      });
    }

    const cacheKey = `suspectSearchService:${cameras.sort().join(",")}:${classes
      .sort()
      .join(",")}:${startTime}:${endTime}:${top_color}:${bottom_color}`;
    console.log("cacheKey", cacheKey);
    // const cachedData = await redisClient.get(cacheKey);
    let results = [];

    // if (cachedData) results = JSON.parse(cachedData);
    // else {
    // Non-live operation: Standard search (historical data)
    results = await suspectSearchService(
      cameras,
      classes,
      startTime,
      endTime,
      top_color,
      bottom_color,
      employeeId
    );
    // if (results.length > 0)
    //   await redisClient.setex(cacheKey, 3600, JSON.stringify(results));
    // }
    //update operation at end
    await prisma.operationLog.update({
      where: { id: newOperation?.id },
      data: {
        operationResponseData: results,
        operationStatus: "INACTIVE",
        closeTimestamp: new Date(),
      },
    });

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

const vehicleOperation = async (req, res) => {
  try {
    const {
      cameras,
      startTime,
      endTime,
      licensePlate,
      ownerName,
      classes,
      topColor,
      bottomColor,
    } = req.body;
    const { type } = req.query;

    let operationData = {};

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
    if (!type) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid operation type",
      });
    }

    if (
      type === "anpr" &&
      !licensePlate &&
      !(ownerName && classes?.length > 0)
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "At least one of [licensePlate], [ownerName and class of vehicle] is required for ANPR",
      });
    } else if (
      type === "anpr" &&
      !licensePlate &&
      ((ownerName && !classes) || (!ownerName && classes))
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "Both [ownerName] and [classes] are required for ANPR while searching with ownerName",
      });
    } else if (
      type === "vehicle_search" &&
      (!classes || !topColor || !bottomColor)
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "All of [classes], [topColor] and [bottomColor] are required for vehicle search",
      });
    }

    if (type === "anpr") {
      operationData = {
        type: "ANPR",
        licensePlate: licensePlate,
        ownerName: ownerName && ownerName.toLowerCase(),
        classes,
        cameras,
        topColor: topColor && topColor.toLowerCase(),
        bottomColor: bottomColor && bottomColor.toLowerCase(),
      };
    } else if (type === "vehicle_search") {
      operationData = {
        type: "VEHICLE SEARCH",
        topColor: topColor && topColor.toLowerCase(),
        bottomColor: bottomColor && bottomColor.toLowerCase(),
        classes,
        cameras,
      };
    }

    let camerasEngaged = await prisma.camera.findMany({
      where: {
        cameraId: {
          in: cameras,
        },
      },
    });

    // Create new operation log entry
    const newOperation = await prisma.operationLog.create({
      data: {
        operationType: operationData?.type,
        operationRequestData: operationData,
        initialTimestamp: new Date(startTime),
        finalTimestamp: new Date(endTime),
        userId: employeeId,
        operationStatus: "ACTIVE",
        cameras: {
          connect: camerasEngaged.map((camera) => ({
            cameraId: camera.cameraId,
          })),
        },
      },
    });

    const currTime = new Date();
    const endtime = new Date(endTime);
    if (currTime < endtime) {
      // Send response indicating SSE has been triggered
      return res.json({
        status: "ok",
        message: `${operationData?.type} live operation initiated`,
        operationId: newOperation.id, // Return the operation ID for SSE
      });
    } else {
      const cacheKey = `vehicleOperation-${type}:${JSON.stringify(
        operationData
      )}:${startTime}:${endTime}`;
      // const cachedData = await redisClient.get(cacheKey);
      let results = [];

      // if (cachedData) results = JSON.parse(cachedData);
      // else {
      // Historical search
      results = await vehicleOperationService(
        operationData,
        cameras,
        startTime,
        endTime
      );
      // await redisClient.setex(cacheKey, 3600, JSON.stringify(results));
      // }
      await prisma.operationLog.update({
        where: { id: newOperation?.id },
        data: {
          operationResponseData: results,
          operationStatus: "INACTIVE",
          closeTimestamp: new Date(),
        },
      });

      if (!results || results.length === 0) {
        return res.json({
          status: "ok",
          message: "No results found",
        });
      }

      return res.json({
        status: "ok",
        message: `${operationData?.type} operation completed successfully`,
        results,
      });
    }
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "Vehicle operation failed",
      error: error.message,
    });
  }
};

const liveSuspectSearch = async (req, res) => {
  try {
    const { operationId } = req.query;

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Fetch the operation details
    const operation = await prisma.operationLog.findUnique({
      where: { id: parseInt(operationId) },
    });

    if (!operation || operation.operationStatus !== "ACTIVE") {
      res
        .status(404)
        .json({ status: "fail", message: "Operation not found or inactive" });
      return res.end();
    }

    // Start the worker for live suspect search
    const worker = new Worker(
      path.resolve(__dirname, "../workers/liveSuspectSearchWorker.js"),
      {
        workerData: {
          operationId: parseInt(operationId),
          operationDetails: {
            cameras: operation.cameras,
            classes: operation.operationRequestData?.classes,
            initialTimestamp: operation.initialTimestamp,
            finalTimestamp: operation.finalTimestamp,
            top_color: operation.operationRequestData?.top_color,
            bottom_color: operation.operationRequestData?.bottom_color,
          },
        },
      }
    );

    // Listen for messages from the worker (live results)
    worker.on("message", async (liveResults) => {
      if (liveResults.error) {
        console.error("Worker reported an error:", liveResults.error);
        await prisma.operationLog.update({
          where: { id: parseInt(operationId) },
          data: {
            operationStatus: "INACTIVE",
            closeTimestamp: new Date(),
          },
        });
        res.write(
          `data: ${JSON.stringify({
            status: "fail",
            message: liveResults.error,
          })}\n\n`
        );
        return res.end();
      }

      // Stream results back to the client
      if (liveResults.data && liveResults.data.length > 0) {
        res.write(`data: ${JSON.stringify(liveResults.data)}\n\n`);
      }
    });

    // Handle worker errors
    worker.on("error", async (error) => {
      console.error("Worker error:", error);
      await prisma.operationLog.update({
        where: { id: parseInt(operationId) },
        data: {
          operationStatus: "INACTIVE",
          closeTimestamp: new Date(),
        },
      });
      res.write(
        `data: ${JSON.stringify({
          status: "fail",
          message: "Error occurred in live search",
        })}\n\n`
      );
      res.end();
    });

    // Handle worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      res.end();
    });

    // Handle client disconnection
    req.on("close", () => {
      console.log("Connection closed by client");
      worker.terminate();
      res.end();
    });
  } catch (error) {
    console.error("Error performing live suspect search:", error);
    res.status(500).json({
      status: "fail",
      message: "Live suspect search failed",
      error: error.message,
    });
  }
};

const liveVehicleOperation = async (req, res) => {
  try {
    const { operationId } = req.query;

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Fetch the operation details
    const operation = await prisma.operationLog.findUnique({
      where: { id: parseInt(operationId) },
    });

    if (!operation || operation.operationStatus !== "ACTIVE") {
      res
        .status(404)
        .json({ status: "fail", message: "Operation not found or inactive" });
      return res.end();
    }

    // Start the worker for live vehicle operation
    const worker = new Worker(
      path.resolve(__dirname, "../workers/liveVehicleOperationWorker.js"),
      {
        workerData: {
          operationId: parseInt(operationId),
          operationDetails: {
            cameras: operation.cameras,
            initialTimestamp: operation.initialTimestamp,
            finalTimestamp: operation.finalTimestamp,
            operationRequestData: operation.operationRequestData,
          },
        },
      }
    );

    // Listen for messages from the worker (live results)
    worker.on("message", async (liveResults) => {
      if (liveResults.error) {
        console.error("Worker reported an error:", liveResults.error);
        await prisma.operationLog.update({
          where: { id: parseInt(operationId) },
          data: {
            operationStatus: "INACTIVE",
            closeTimestamp: new Date(),
          },
        });
        res.write(
          `data: ${JSON.stringify({
            status: "fail",
            message: liveResults.error,
          })}\n\n`
        );
        return res.end();
      }

      // Stream results back to the client
      if (liveResults.data && liveResults.data.length > 0) {
        res.write(`data: ${JSON.stringify(liveResults.data)}\n\n`);
      }
    });

    // Handle worker errors
    worker.on("error", async (error) => {
      console.error("Worker error:", error);
      await prisma.operationLog.update({
        where: { id: parseInt(operationId) },
        data: {
          operationStatus: "INACTIVE",
          closeTimestamp: new Date(),
        },
      });
      res.write(
        `data: ${JSON.stringify({
          status: "fail",
          message: "Error occurred in live operation",
        })}\n\n`
      );
      res.end();
    });

    // Handle worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      res.end();
    });

    // Handle client disconnection
    req.on("close", () => {
      console.log("Connection closed by client");
      worker.terminate();
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Error performing operation",
      error: error.message,
    });
  }
};

const getOperations = async (req, res) => {
  try {
    const { type, opTypes } = req.body;
    console.log("type", type);
    console.log("opType", opTypes);
    const employeeId = req.userId;
    console.log("employeeId", employeeId);

    if (!employeeId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized access",
      });
    }

    const getOperationsData = async () => {
      const operations = await getOperationsService(type, opTypes, employeeId);
      if (!operations || operations.length === 0) {
        return null;
      }
      return operations;
    };

    const operations = await getOperationsData();

    if (!operations) {
      return res.json({
        status: "ok",
        message: "No operations found",
      });
    }

    return res.json({
      status: "ok",
      message: "Operations fetched successfully",
      operations,
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

const liveIncidentsTracking = async (req, res) => {
  try {
    const employeeId = req.userId;
    if (!employeeId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized access",
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let startTime = new Date();

    const checkForIncidents = async () => {
      while (true) {
        const incidents = await incidentsSearchService(startTime);

        if (incidents && incidents.length > 0) {
          res.write(`data: ${JSON.stringify(incidents)}\n\n`);

          startTime = new Date(
            Math.max(
              ...incidents.map((incident) =>
                new Date(incident?.timestamp).getTime()
              )
            ) + 1
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    };

    checkForIncidents();

    req.on("close", () => {
      console.log("Connection closed by client");
      res.end();
    });
  } catch (error) {
    console.error("Error performing operation:", error);
    res.status(500).json({
      status: "fail",
      message: "Incident tracking failed",
      error: error.message,
    });
  }
};

export {
  suspectSearch,
  vehicleOperation,
  getOperations,
  liveVehicleOperation,
  liveSuspectSearch,
  liveIncidentsTracking,
};
