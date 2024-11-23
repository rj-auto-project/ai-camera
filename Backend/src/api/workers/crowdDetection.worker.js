import { parentPort, workerData } from "worker_threads";
import CrowdCountService from "../services/crowd.service.js";

async function performLiveCrowdDetection(operationDetails) {
  const { cameras, initialTimestamp, finalTimestamp, threshold, employeeId } =
    operationDetails;

  try {
    while (new Date() < new Date(finalTimestamp)) {
      const results = await CrowdCountService.getLiveData(
        cameras,
        initialTimestamp,
        threshold
      );

      if (results.length > 0) {
        parentPort.postMessage({ data: results });
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    parentPort.postMessage({ completed: true });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

performLiveCrowdDetection(workerData.operationDetails);
