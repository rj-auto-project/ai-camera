import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import prisma from "../../config/prismaClient.js";
import { runWorker } from "../../utils/runWorker.js";

const getCamerasFormap = async () => {
  const cameras = await prisma.camera.findMany();
  if (!cameras) throw new Error("No cameras found");
  return cameras;
};

// const performOperation = async (req, res, next) => {
//   try {
//     const { cameras, operation_type } = req.body;

//     let result;
//     switch (operation_type) {
//       case "ANPR":
//         result = await runWorker("../workers/anpr.worker.js", cameras);
//         break;

//       case "Crowd Detection":
//         result = await runWorker(
//           "../workers/crowdDetection.worker.js",
//           cameras
//         );
//         break;

//       default:
//         throw new Error("Invalid operation type");
//     }
//     return result;
//   } catch (error) {
//     console.error("Error performing operation:", error);
//     return next(error);
//   }
// };

const getHeatmap = async () => {
  const allRecords = await prisma.crowdCount.findMany({
    orderBy: {
      timestamp: "desc",
    },
  });
  let latestHeatmap = Object.values(
    allRecords.reduce((acc, record) => {
      if (!acc[record.camera_ip]) {
        acc[record.camera_ip] = record;
      }
      return acc;
    }, {})
  );

  return latestHeatmap;
};

export { getCamerasFormap, getHeatmap };
