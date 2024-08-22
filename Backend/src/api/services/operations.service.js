import prisma from "../../config/prismaClient.js";

const faceDetectionService = async (imagepath) => {};

const suspectSearchService = async (
  classname,
  top_color,
  bottom_color,
  start_time,
  end_time,
  cameras,
  location,
) => {};

const getClasses = async (objectType) => {
  if (objectType) {
    const result = await prisma.class.findMany({
      where: {
        objectType: objectType,
      },
    });
    return result;
  }
  const result = await prisma.class.findMany();
  return result;
};

// utility functions

//get cameras by location
async function getCamerasByLocation(location) {
  const cameras = await prisma.camera.findMany({
    where: {
      location: location,
    },
  });
  return cameras;
}

export {
  suspectSearchService,
  getClasses,
  faceDetectionService,
  getCamerasByLocation,
};
