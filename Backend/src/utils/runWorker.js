import { Worker } from "worker_threads";

const runWorker = (worker, data) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

export { runWorker };
