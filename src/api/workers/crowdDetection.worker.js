import { parentPort, workerData } from "worker_threads";

function performCrowdDetection(cameraDetails) {
  // Perform CPU-intensive Crowd Detection operation here
  // Simulated with a delay
  return { message: "Crowd Detection result", data: cameraDetails };
}

const result = performCrowdDetection(workerData.cameraDetails);
parentPort.postMessage(result);
