import { parentPort, workerData } from "worker_threads";

function performANPR(cameraDetails) {
  // Perform CPU-intensive ANPR operation here
  // Simulated with a delay
  return { message: "ANPR result", data: cameraDetails };
}

const result = performANPR(workerData.cameraDetails);
parentPort.postMessage(result);
