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
  employeeId,
) => {
  // Convert startTime and endTime to Date objects
  const start = new Date(startTime);
  const end = new Date(endTime);

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
        classes: classes,
        startTime: start,
        endTime: end,
        topColor: top_color,
        bottomColor: bottom_color,
      },
      initialTimestamp: new Date(),
      finalTimestamp: new Date(),
      userId: employeeId,
      closeTimestamp: new Date(),
    },
  });

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
    distinct: ["trackId"],
  });

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

  // Update operation log with results
  await prisma.operationLog.update({
    where: {
      id: newOperation?.id,
    },
    data: {
      operationResponseData: {
        results: results,
      },
      finalTimestamp: new Date(),
      closeTimestamp: new Date(),
      operationStatus: "INACTIVE",
    },
  });

  return results;
};

const vehicleOperationService = async (
  operationData,
  cameras,
  startTime,
  endTime,
) => {
  const { type, classes } = operationData;
  let results = [];
  if (type === "ANPR") {
    results = await prisma.anprLogs.findMany({
      where: {
        camera_id: {
          in: cameras,
        },
        time_stamp: {
          gte: new Date(startTime),
          lte: new Date(endTime),
        },
        OR: [
          {
            license_number: {
              equals: operationData?.licensePlate,
            },
          },
          {
            AND: [
              {
                ownerName: {
                  equals: operationData?.ownerName,
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
      distinct: ["trackId"],
    });
  } else if (type === "VEHICLE SEARCH") {
    results = await prisma.detectionLog.findMany({
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
              equals: operationData?.topColor,
            },
            bottomColor: {
              equals: operationData?.bottomColor,
            },
          },
          {
            topColor: {
              equals: operationData?.bottomColor,
            },
            bottomColor: {
              equals: operationData?.topColor,
            },
          },
        ],
      },
      distinct: ["trackId"],
    });
  }

  if (!results || results.length === 0) {
    return [];
  }

  // Generate thumbnails
  const thumbnailPromises = results.map(async (result) => {
    const { datefolder, videotime } = formatTimestamp(result?.timestamp);
    const thumbnailPath = await getThumbnail(
      `D:\\RJ ai cam\\videofeed\\${datefolder}\\${result?.cameraId}\\${videotime}.mp4`,
      result?.time_stamp || result?.timestamp,
    );
    result.thumbnail = thumbnailPath || "";
    return result;
  });

  results = await Promise.all(thumbnailPromises);

  return results;
};

const getOperationsService = async (type) => {
  if (type === "active") {
    const activeOperations = await prisma.operationLog.findMany({
      where: {
        operationStatus: "ACTIVE",
      },
    });
    return activeOperations;
  } else if (type === "inactive") {
    const inactiveOperations = await prisma.operationLog.findMany({
      where: {
        operationStatus: "INACTIVE",
      },
    });
    return inactiveOperations;
  } else {
    const allOperations = await prisma.operationLog.findMany();
    return allOperations;
  }
};

// utility functions
export { suspectSearchService, getOperationsService, vehicleOperationService };
