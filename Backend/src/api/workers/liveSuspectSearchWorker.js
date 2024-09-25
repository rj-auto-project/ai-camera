import { parentPort, workerData } from 'worker_threads';
import { suspectSearchService } from '../services/operations.service.js';
import prisma from '../../config/prismaClient.js';

(async () => {
  try {
    const { operationId, operationDetails } = workerData;
    let lastFetchedTimestamp = operationDetails.initialTimestamp || new Date();

    // Continue fetching data until the final timestamp
    while (new Date() < new Date(operationDetails.finalTimestamp)) {
      console.log('Performing live search', lastFetchedTimestamp, new Date().toISOString());

      // Perform the suspect search operation
      const liveResults = await suspectSearchService(
        operationDetails.cameras,
        operationDetails.classes,
        lastFetchedTimestamp,
        new Date().toISOString(),
        operationDetails.top_color,
        operationDetails.bottom_color
      );

      // Send results back to the main thread
      if (liveResults && liveResults.length > 0) {
        parentPort.postMessage({ data: liveResults });

        // Update the last fetched timestamp
        const latestTimestamp = Math.max(...liveResults.map(result => new Date(result.timestamp).getTime()));
        lastFetchedTimestamp = new Date(latestTimestamp + 1);

        // Update operation log with the new results
        await prisma.operationLog.update({
          where: { id: operationId },
          data: {
            operationResponseData: {
              push: liveResults
            },
          },
        });
      }

      // Pause for a brief period before the next fetch
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Signal the end of the operation
    parentPort.postMessage({ data: [], finished: true });

  } catch (error) {
    console.error('Error in live suspect search worker:', error);
    parentPort.postMessage({ error: error.message });
  }
})();
