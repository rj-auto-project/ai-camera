import prisma from "../../config/prismaClient.js";

const getCamerasFormap = async () => {
  const cameras = await prisma.camera.findMany();
  if (!cameras) throw new Error("No cameras found");
  return cameras;
};

export { getCamerasFormap };
