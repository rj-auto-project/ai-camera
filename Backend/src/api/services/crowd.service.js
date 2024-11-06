import { getThumbnail } from '../../utils/extractThumbnail.js';
import { formatTimestamp } from '../../utils/helperFunctions.js';
import prisma from '../../config/prismaClient.js';


class CrowdCountService {
  static async getHistoricalData(cameras, startTime, endTime, threshold, employeeId) {
    try {
      const crowdCounts = await prisma.detectionLog.groupBy({
        by: ['cameraId', 'timestamp'],
        where: {
          cameraId: { in: cameras },
          timestamp: {
            gte: new Date(startTime),
            lte: new Date(endTime)
          }
        },
        _count: {
          trackId: true
        },
        having: {
          trackId: {
            _count: {
              gt: threshold
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return await this.enrichCrowdData(crowdCounts, threshold);
    } catch (error) {
      console.error('Error in getHistoricalData:', error);
      throw error;
    }
  }

  static async getLiveData(cameras, startTime, threshold) {
    try {
      const crowdCounts = await prisma.detectionLog.groupBy({
        by: ['cameraId', 'timestamp'],
        where: {
          cameraId: { in: cameras },
          timestamp: {
            gte: new Date(startTime),
            lte: new Date()
          }
        },
        _count: {
          trackId: true
        },
        having: {
          trackId: {
            _count: {
              gt: threshold
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return await this.enrichCrowdData(crowdCounts, threshold);
    } catch (error) {
      console.error('Error in getLiveData:', error);
      throw error;
    }
  }

  static async enrichCrowdData(crowdCounts, threshold) {
    if (!crowdCounts || crowdCounts.length === 0) {
      return [];
    }

    return Promise.all(crowdCounts.map(async (count) => {
      const cameraDetails = await prisma.camera.findUnique({
        where: { cameraId: count.cameraId },
        select: {
          location: true,
          cameraName: true,
          cameraType: true
        }
      });

      const { datefolder, videotime } = formatTimestamp(count.timestamp);
      const thumbnailPath = await getThumbnail(
        `D:\\RJ ai cam\\videofeed\\${datefolder}\\${count.cameraId}\\${videotime}.mp4`,
        count.timestamp
      );

      return {
        ...count,
        camera: cameraDetails,
        crowdCount: count._count.trackId,
        thumbnail: thumbnailPath || '',
        threshold,
        exceededBy: count._count.trackId - threshold,
        status: 'THRESHOLD_EXCEEDED'
      };
    }));
  }
}

export default CrowdCountService;