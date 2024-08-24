import prisma from "../config/prismaClient.js";

const getObjectTypes = async (req, res) => {
  const distinctObjectTypes = await prisma.class.findMany({
    distinct: ["objectType"],
    select: {
      objectType: true,
    },
  });
  res.json({ objectTypes: distinctObjectTypes });
};

const getClassList = async (req, res) => {
  try {
    const { objectType } = req.query;
    if (objectType) {
      const classes = await prisma.class.findMany({
        where: {
          objectType,
        },
      });
      if (!classes) {
        return res.status(404).json({
          status: "fail",
          message: "No classes found for the specified objectType",
        });
      }
      return res.json({
        status: "ok",
        message: "Classes fetched successfully",
        classes,
      });
    } else {
      const classes = await prisma.class.findMany();
      if (!classes) {
        return res.status(404).json({
          status: "fail",
          message: "No classes found",
        });
      }
      return res.json({
        status: "ok",
        message: "Classes fetched successfully",
        classes,
      });
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

export { getObjectTypes, getClassList };
