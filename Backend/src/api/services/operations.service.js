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
              equals: operationData?.topColor,
            },
          },
          {
            bottomColor: {
              equals: operationData?.bottomColor,
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

const getOperationsService = async (type, employeeId = "") => {
  if (type === "active") {
    const activeOperations = await prisma.operationLog.findMany({
      where: {
        operationStatus: "ACTIVE",
        userId: employeeId,
      },
      include: {
        cameras: true,
      },
    });
    return activeOperations;
  } else if (type === "inactive") {
    const inactiveOperations = await prisma.operationLog.findMany({
      where: {
        operationStatus: "INACTIVE",
        userId: employeeId,
      },
    });
    return inactiveOperations;
  } else {
    const allOperations = await prisma.operationLog.findMany({
      where: {
        userId: employeeId,
      },
      include: {
        cameras: true,
      },
    });
    return allOperations;
  }
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
