import { parentPort, workerData } from "worker_threads";
import prisma from "../../config/prismaClient.js";
import { vehicleOperationService } from "../services/operations.service.js";

(async () => {
  try {
    const { operationId, operationDetails } = workerData;
    let lastFetchedTimestamp = new Date(operationDetails.initialTimestamp);

    while (new Date() < new Date(operationDetails.finalTimestamp)) {
      const liveResults = await vehicleOperationService(
        operationDetails.operationRequestData,
        operationDetails.cameras,
        lastFetchedTimestamp,
        new Date().toISOString(),
      );

      if (liveResults && liveResults.length > 0) {
        parentPort.postMessage({ data: liveResults });

        // Update the operation log in the database
        const updateOperation = await prisma.operationLog.findUnique({
          where: { id: operationId },
        });

        const dataToUpdate = updateOperation.operationResponseData
          ? [...updateOperation.operationResponseData, ...liveResults]
          : liveResults;

        await prisma.operationLog.update({
          where: { id: operationId },
          data: {
            operationResponseData: dataToUpdate,
          },
        });

        // Update last fetched timestamp
        const latestTimestamp = Math.max(
          ...liveResults.map((result) =>
            new Date(result?.time_stamp || result?.timestamp).getTime(),
          ),
        );
        lastFetchedTimestamp = new Date(latestTimestamp + 1);
      }

      // Add a delay to prevent the loop from running too frequently
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    parentPort.close(); // Close the worker when done
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
})();
