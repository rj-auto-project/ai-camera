import prisma from "../../config/prismaClient.js";

const detectGarbageService = async () => {
  let results = await prisma.detectionLog.findMany({
    where: {
      detectionClass: {
        equals: "garbage",
      },
    },
    distinct: ["trackId"],
  });

  return results || [];
};

export { detectGarbageService };
