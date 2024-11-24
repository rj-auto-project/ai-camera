import { Worker } from 'worker_threads';
import path from 'path';
import prisma from '../../config/prismaClient.js';
import CrowdCountService from '../services/crowd.service.js';


const crowdDetectionController = {
  crowdRestriction: async (req, res) => {
    try {
      const { cameras, startTime, endTime, threshold } = req.body;
      const employeeId = req.userId;

      // Authentication check
      if (!employeeId) {
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized access",
        });
      }

      // Input validation
      if (!cameras || cameras.length === 0) {
        return res.status(400).json({
          status: "fail",
          message: "No cameras provided",
        });
      }

      if (!startTime || !endTime || !threshold) {
        return res.status(400).json({
          status: "fail",
          message: "Missing required fields: startTime, endTime, threshold are required.",
        });
      }

      // Get cameras' details
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

      // Create operation log
      const newOperation = await prisma.operationLog.create({
        data: {
          operationType: "CROWD_COUNT",
          cameras: {
            connect: camerasEngagedInOperation.map((camera) => ({
              cameraId: camera?.cameraId,
            })),
          },
          operationRequestData: { threshold },
          initialTimestamp: new Date(startTime),
          finalTimestamp: new Date(endTime),
          userId: employeeId,
          operationStatus: "ACTIVE"
        },
      });

      const currTime = new Date();
      const endTime_date = new Date(endTime);

      // Handle live monitoring if end time is in the future
      if (currTime < endTime_date) {
        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Start worker for live monitoring
        const worker = new Worker(
          path.resolve(__dirname, '../workers/crowdDetection.worker.js'),
          {
            workerData: {
              operationId: newOperation.id,
              operationDetails: {
                cameras: cameras,
                initialTimestamp: startTime,
                finalTimestamp: endTime,
                threshold: threshold,
                employeeId: employeeId
              }
            }
          }
        );

        // Handle worker messages
        worker.on('message', async (message) => {
          if (message.error) {
            await handleWorkerError(newOperation.id, message.error, res);
            return;
          }

          if (message.completed) {
            await handleOperationComplete(newOperation.id, res);
            return;
          }

          if (message.data) {
            res.write(`data: ${JSON.stringify(message.data)}\n\n`);
          }
        });

        // Handle worker errors
        worker.on('error', async (error) => {
          console.error('Worker error:', error);
          await updateOperationStatus(newOperation.id, 'INACTIVE');
          res.write(`data: ${JSON.stringify({ status: 'fail', message: 'Worker error occurred' })}\n\n`);
          res.end();
        });

        // Handle client disconnect
        req.on('close', async () => {
          console.log('Client disconnected');
          await updateOperationStatus(newOperation.id, 'INACTIVE');
          worker.terminate();
          res.end();
        });
      } else {
        // Handle historical data request
        const results = await CrowdCountService.getHistoricalData(
          cameras,
          startTime,
          endTime,
          threshold,
          employeeId
        );

        // Update operation log
        await prisma.operationLog.update({
          where: { id: newOperation.id },
          data: {
            operationResponseData: results,
            operationStatus: "INACTIVE",
            closeTimestamp: new Date(),
          },
        });

        if (!results || results.length === 0) {
          return res.json({
            status: "ok",
            message: "No results found",
          });
        }

        return res.json({
          status: "ok",
          message: "Crowd count operation completed successfully",
          results,
        });
      }
    } catch (error) {
      console.error("Error in crowd detection:", error);
      res.status(500).json({
        status: "fail",
        message: "Crowd detection operation failed",
        error: error.message,
      });
    }
  }
};

// Helper functions
async function handleWorkerError(operationId, error, res) {
  await updateOperationStatus(operationId, 'INACTIVE');
  res.write(`data: ${JSON.stringify({ status: 'fail', message: error })}\n\n`);
  res.end();
}

async function handleOperationComplete(operationId, res) {
  await updateOperationStatus(operationId, 'INACTIVE');
  res.write(`data: ${JSON.stringify({ status: 'success', message: 'Operation completed' })}\n\n`);
  res.end();
}

async function updateOperationStatus(operationId, status) {
  await prisma.operationLog.update({
    where: { id: operationId },
    data: {
      operationStatus: status,
      closeTimestamp: status === 'INACTIVE' ? new Date() : undefined
    }
  });
}

export default crowdDetectionController;