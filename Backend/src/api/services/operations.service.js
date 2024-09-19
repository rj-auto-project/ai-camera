import { Status } from "@prisma/client";
import prisma from "../../config/prismaClient.js";
import { getThumbnail } from "../../utils/extractThumbnail.js";
import { formatTimestamp } from "../../utils/helperFunctions.js";

// const faceDetectionService = async (imagepath) => {};

const suspectSearchService = async (
  cameras,
  classes,
  startTime,
  endTime,
  top_color,
  bottom_color,
) => {
  // Perform the search
  let results = await prisma.detectionLog.findMany({
    where: {
      cameraId: {
        in: cameras,
      },
      timestamp: {
        gte: new Date(startTime),
        lte: new Date(endTime),
      },
      detectionClass: {
        in: classes,
      },
      OR: [
        {
          topColor: {
            equals: top_color,
          },
        },
        {
          bottomColor: {
            equals: top_color,
          },
        },
        {
          topColor: {
            equals: bottom_color,
          },
        },
        {
          bottomColor: {
            equals: bottom_color,
          },
        },
      ],
    },
    include: {
      camera: true,
    },
    distinct: ["trackId"],
  });
  // results = results.map(async (result) => {
  //   const cameraDetails = await prisma.camera.findUnique({
  //     where: {
  //       cameraId: result.cameraId,
  //     },
  //   });
  //   result.cameraDetails = cameraDetails;
  // });
  if (!results || results.length === 0) {
    return [];
  }

  // Generate thumbnails
  const thumbnailPromises = results.map(async (result) => {
    const { datefolder, videotime } = formatTimestamp(result?.timestamp);
    const thumbnailPath = await getThumbnail(
      `D:\\RJ ai cam\\videofeed\\${datefolder}\\${result?.cameraId}\\${videotime}.mp4`,
      result?.timestamp,
    );
    result.thumbnail = thumbnailPath || "";
    return result;
  });

  results = await Promise.all(thumbnailPromises);

  return results;
};

const vehicleOperationService = async (
  operationData,
  cameras,
  startTime,
  endTime,
) => {
  const { type, classes, licensePlate, ownerName, topColor, bottomColor } = operationData;
  let results = [];

  // Validate inputs
  if (!cameras || !Array.isArray(cameras) || cameras.length === 0) {
    throw new Error("Invalid cameras input. Cameras must be a non-empty array.");
  }

  if (!startTime || !endTime) {
    throw new Error("StartTime and EndTime are required.");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date format. Please provide valid start and end times.");
  }

  if (start >= end) {
    throw new Error("StartTime must be earlier than EndTime.");
  }

  try {
    if (type === "ANPR") {
      // Fetch ANPR results
      results = await prisma.anprLogs.findMany({
        where: {
          camera_id: {
            in: cameras,
          },
          time_stamp: {
            gte: start,
            lte: end,
          },
          OR: [
            {
              license_number: {
                equals: licensePlate?.trim(),
              },
            },
            {
              AND: [
                {
                  ownerName: {
                    equals: ownerName?.trim().toLowerCase(),
                  },
                },
                {
                  detectionClass: {
                    in: classes,
                  },
                },
              ],
            },
          ],
        },
        include: {
          camera: {
            select: {
              cameraId: true,
              cameraName: true,
              location: true,
              cameraType: true,
            },
          },
        },
        distinct: ["trackId"],
      });
    } else if (type === "VEHICLE SEARCH") {
      // Fetch Vehicle Search results
      results = await prisma.detectionLog.findMany({
        where: {
          cameraId: {
            in: cameras,
          },
          timestamp: {
            gte: start,
            lte: end,
          },
          detectionClass: {
            in: classes,
          },
          OR: [
            {
              AND: [
                { topColor: { equals: topColor?.trim().toLowerCase() } },
                { bottomColor: { equals: bottomColor?.trim().toLowerCase() } },
              ],
            },
            {
              topColor: {
                equals: topColor?.trim().toLowerCase(),
              },
            },
            {
              bottomColor: {
                equals: bottomColor?.trim().toLowerCase(),
              },
            },
          ],
        },
        include: {
          camera: {
            select: {
              cameraId: true,
              cameraName: true,
              location: true,
              cameraType: true,
            },
          },
        },
        distinct: ["trackId"],
      });
    }

    // Handle no results found
    if (!results || results.length === 0) {
      return [];
    }

    // Generate thumbnails for each result
    const thumbnailPromises = results.map(async (result) => {
      const { datefolder, videotime } = formatTimestamp(result?.timestamp || result?.time_stamp);
      const videoPath = `D:\\RJ ai cam\\videofeed\\${datefolder}\\${result?.cameraId}\\${videotime}.mp4`;

      // Ensure the video file exists and generate thumbnail
      try {
        const thumbnailPath = await getThumbnail(videoPath, result?.timestamp || result?.time_stamp);
        result.thumbnail = thumbnailPath || "";
      } catch (thumbnailError) {
        console.error(`Error generating thumbnail for ${videoPath}:`, thumbnailError);
        result.thumbnail = "";  // Default to an empty string if thumbnail generation fails
      }

      return result;
    });

    // Wait for all thumbnails to be processed
    results = await Promise.all(thumbnailPromises);

    return results;
  } catch (error) {
    console.error("Error fetching vehicle operation data:", error.message);
    throw new Error("An error occurred while processing the vehicle operation.");
  }
};


const getOperationsService = async (type, opTypes, employeeId) => {
  const status =
    type === "active" ? "ACTIVE" : (type === "inactive" && "INACTIVE") || null;
  opTypes = opTypes.map((opType) => opType.replace(/_/g, " ").toUpperCase());

  const query = {
    where: {
      userId: employeeId,
      ...(status && { operationStatus: status }),
      ...(opTypes.length > 0 && { operationType: { in: opTypes } }),
    },
    include: {
      cameras: true,
    },
    orderBy: {
      operationTimestamp: "desc",
    },
  };

  // // Add a condition to fetch only data after lastSentTimestamp if available
  // if (lastSentTimestamp) {
  //   query.where.operationTimestamp = {
  //     gt: lastSentTimestamp,
  //   };
  // }

  const operations = await prisma.operationLog.findMany(query);

  return operations;
};

const incidentsSearchService = async (startTime) => {
  const incidents = await prisma.detectionLog.findMany({
    where: {
      incidentType: {
        not: null,
      },
      timestamp: {
        gte: startTime,
      },
    },
    distinct: ["trackId"],
  });

  return incidents;
};

// utility functions
export {
  suspectSearchService,
  getOperationsService,
  vehicleOperationService,
  incidentsSearchService,
};
