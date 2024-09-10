import prisma from "../../config/prismaClient.js";

const detectGarbageService = async () => {
  const classes = ["garbage", "pothole"];
  let results = await prisma.detectionLog.findMany({
    where: {
      detectionClass: {
        in: classes,
      },
    },
    include: {
      camera: true,
    },
    distinct: ["trackId"],
  });

  return results || [];
};

export { detectGarbageService };
