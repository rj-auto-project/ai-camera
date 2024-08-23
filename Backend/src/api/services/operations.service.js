import prisma from "../../config/prismaClient.js";
import { getThumbnail } from "../../utils/extractThumbnail.js";

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

  // log this operation
  const newOperation = await prisma.operationLog.create({
    data: {
      operationType: "SUSPECT SEARCH",
      cameras: {
        connect: camerasEngagedInOperation.map((camera) => ({
          cameraId: camera?.cameraId,
        })),
      },
      operationData: "Pending",
      initialTimestamp: new Date(),
      finalTimestamp: new Date(),
      userId: employeeId,
      closeTimestamp: new Date(),
    },
  });
  const start_time = new Date(startTime).toISOString();
  const end_time = new Date(endTime).toISOString();

  let results = await prisma.detectionLog.findMany({
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

  if (!results || results.length === 0) {
    return [];
  }

  const thumbnailPromises = results.map(async (result) => {
    const thumbnailPath = await getThumbnail(
      "D:\\RJ ai cam\\traffic_light.mp4",
      result?.timestamp,
      result?.boxCoords,
    );
    result.thumbnail = thumbnailPath;
    return result;
  });

  results = await Promise.all(thumbnailPromises);

  await prisma.operationLog.update({
    where: {
      id: newOperation?.id,
    },
    data: {
      operationData: results,
      finalTimestamp: new Date(),
      closeTimestamp: new Date(),
      operationStatus: "INACTIVE",
    },
  });

  return results;
};

const getClasses = async (objectType) => {
  if (objectType) {
    const result = await prisma.class.findMany({
      where: {
        objectType: objectType,
      },
    });
    return result;
  }
  const result = await prisma.class.findMany();
  return result;
};

// utility functions
export { suspectSearchService, getClasses };
