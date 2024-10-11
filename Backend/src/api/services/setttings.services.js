import prisma from "../../config/prismaClient.js";

class CameraService {
  async addCamera(cameraData) {
    return await prisma.camera.create({
      data: {
        cameraId: cameraData.cameraId,
        cameraIp: cameraData.cameraIp,
        cameraName: cameraData.cameraName,
        coordinates: cameraData.cameraCoordinates,
        location: cameraData.cameraLocation,
        vehicleCountThreshold: cameraData.vehicleCountThreshold,
        crowdCountThreshold: cameraData.crowdCountThreshold,
        facingAngle: cameraData.facingAngle,
        areaName: cameraData.areaName,
        cameraType: cameraData.cameraType,
        connectionType: cameraData.connectionType ,
        imageCoordinates: cameraData.imageCoordinates,
        manufacturer: cameraData.manufacturer
      },
    });
  }

  async getCameraById(cameraId) {
    return await prisma.camera.findUnique({
      where: { cameraId },
    });
  }

  async updateCamera(cameraId, cameraData) {
    console.log(cameraData)
    return await prisma.camera.update({
      where: { cameraId },
      data: {
        cameraId: cameraData.cameraId,
        cameraIp: cameraData.cameraIp,
        cameraName: cameraData.cameraName,
        coordinates: cameraData.cameraCoordinates,
        location: cameraData.cameraLocation,
        vehicleCountThreshold: cameraData.vehicleCountThreshold,
        crowdCountThreshold: cameraData.crowdCountThreshold,
        facingAngle: cameraData.facingAngle,
        areaName: cameraData.areaName,
        cameraType: cameraData.cameraType,
        connectionType: cameraData.connectionType ,
        imageCoordinates: cameraData.imageCoordinates,
        manufacturer: cameraData.manufacturer
      },
    });
  }
  // Get all cameras (optional pagination)
  async getAllCameras(skip = 0, take = 10) {
    return await prisma.camera.findMany({
      skip: Number(skip),
      take: Number(take),
    });
  }
}

export default new CameraService();
