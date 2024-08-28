import fs from "fs";
import {
  suspectSearchService,
  getOperationsService,
  vehicleOperationService,
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

    if (!top_color || !bottom_color) {
      return res.status(400).json({
        status: "fail",
        message: "At least one color is required",
      });
    }

    if (top_color && !bottom_color) bottom_color = top_color;
    if (!top_color && bottom_color) top_color = bottom_color;

    let classesToSearchIn = await prisma.class.findMany({
      where: {
        objectType: {
          not: "vehicle",
        },
      },
    });
    classesToSearchIn = classesToSearchIn.map((c) => c.className);
    let currTime = new Date();
    const endtime = new Date(endTime);

    // Live search operation
    if (currTime < endtime) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const liveSearch = async () => {
        let lastFetchedTimestamp = new Date(startTime); // Initialize with startTime

        while (new Date() < endtime) {
          currTime = new Date(); // Update the current time

          console.log(
            "Performing live search...",
            new Date(lastFetchedTimestamp),
            currTime,
          );

          const liveResults = await suspectSearchService(
            cameras,
            classesToSearchIn,
            new Date(lastFetchedTimestamp),
            new Date().toISOString(),
            top_color,
            bottom_color,
            employeeId,
          );

          if (liveResults && liveResults.length > 0) {
            // Send the new results
            res.write(`data: ${JSON.stringify(liveResults)}\n\n`);

            // Update lastFetchedTimestamp to the latest timestamp in the results
            const latestTimestamp = Math.max(
              ...liveResults.map((result) =>
                new Date(result.timestamp).getTime(),
              ),
            );
            lastFetchedTimestamp = new Date(latestTimestamp + 1); // Increment slightly to avoid overlap
          }

          await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
        }

        res.end(); // End the SSE stream when the loop ends or the end time is reached
      };

      await liveSearch();

      req.on("close", () => {
        console.log("Connection closed by client");
        res.end();
      });

      await prisma.operationLog.update({
        where: {
          id: newOperation?.id,
        },
        data: {
          closeTimestamp: new Date(),
          operationStatus: "INACTIVE",
        },
      });

      return;
    }

    // Non-live operation: Standard search (historical data)
    const results = await suspectSearchService(
      cameras,
      classesToSearchIn,
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
    if (!cameras) {
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

    if (type === "anpr" && !licensePlate && !ownerName && !classes) {
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
        licensePlate: licensePlate && licensePlate.toLowerCase(),
        ownerName: ownerName && ownerName.toLowerCase(),
        classes,
        cameras,
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
        closeTimestamp: new Date(),

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
      // Historical search
      const results = await vehicleOperationService(
        operationData,
        cameras,
        startTime,
        endTime,
      );

      await prisma.operationLog.update({
        where: { id: newOperation?.id },
        data: { operationResponseData: results, operationStatus: "INACTIVE" },
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

const liveVehicleOperation = async (req, res) => {
  try {
    const { operationId } = req.query;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const liveSearch = async () => {
      const operation = await prisma.operationLog.findUnique({
        where: { id: parseInt(operationId) },
      });

      if (!operation) {
        res
          .status(404)
          .json({ status: "fail", message: "Operation not found" });
        return res.end();
      }

      let lastFetchedTimestamp = operation?.initialTimestamp || new Date();

      while (new Date() < new Date(operation.finalTimestamp)) {
        const liveResults = await vehicleOperationService(
          operation.operationRequestData,
          operation.cameras,
          lastFetchedTimestamp,
          new Date().toISOString(),
        );

        if (liveResults && liveResults.length > 0) {
          res.write(`data: ${JSON.stringify(liveResults)}\n\n`);

          const updateOperation = await prisma.operationLog.findUnique({
            where: { id: parseInt(operationId) },
          });
          const dataToUpdate =
            [...updateOperation.operationResponseData, ...liveResults] ||
            liveResults;
          await prisma.operationLog.update({
            where: { id: parseInt(operationId) },
            data: {
              operationResponseData: dataToUpdate,
            },
          });

          const latestTimestamp = Math.max(
            ...liveResults.map((result) =>
              new Date(result?.time_stamp || result?.timestamp).getTime(),
            ),
          );
          lastFetchedTimestamp = new Date(latestTimestamp + 1);
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      res.end();
    };

    await liveSearch();

    req.on("close", () => {
      console.log("Connection closed by client");
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
    const { type } = req.query;
    const operations = await getOperationsService(type);
    res.json({
      status: "ok",
      message: "Operations fetched successfully",
      operations,
    });
  } catch (error) {
    console.error("Error fetching operations:", error);
    res.status(500).json({
      status: "fail",
      message: "Error fetching operations",
      error: error.message,
    });
  }
};

export { suspectSearch, vehicleOperation, getOperations, liveVehicleOperation };
