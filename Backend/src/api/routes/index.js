import express from "express";

import authRoutes from "./auth.routes.js";
import mapRoutes from "./map.routes.js";
import operationsRoutes from "./operations.route.js";
import prisma from "../../config/prismaClient.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/map", mapRoutes);
router.use("/operations", operationsRoutes);

// router.post("/insert-data", async (req, res) => {
//   const classes = [
//     { className: "apache", classStatus: "ACTIVE" },
//     { className: "auto", classStatus: "ACTIVE" },
//     { className: "bike-rider", classStatus: "ACTIVE" },
//     { className: "bolero", classStatus: "ACTIVE" },
//     { className: "bullet", classStatus: "ACTIVE" },
//     { className: "bus", classStatus: "ACTIVE" },
//     { className: "car", classStatus: "ACTIVE" },
//     { className: "child", classStatus: "ACTIVE" },
//     { className: "hatchback", classStatus: "ACTIVE" },
//     { className: "helmet", classStatus: "ACTIVE" },
//     { className: "jcb", classStatus: "ACTIVE" },
//     { className: "license-plate", classStatus: "ACTIVE" },
//     { className: "man", classStatus: "ACTIVE" },
//     { className: "motorbike", classStatus: "ACTIVE" },
//     { className: "motorbike-rider", classStatus: "ACTIVE" },
//     { className: "no-helmet", classStatus: "ACTIVE" },
//     { className: "omni", classStatus: "ACTIVE" },
//     { className: "person", classStatus: "ACTIVE" },
//     { className: "pickup", classStatus: "ACTIVE" },
//     { className: "pulsar", classStatus: "ACTIVE" },
//     { className: "scooty", classStatus: "ACTIVE" },
//     { className: "scooty-rider", classStatus: "ACTIVE" },
//     { className: "scorpio", classStatus: "ACTIVE" },
//     { className: "sedan", classStatus: "ACTIVE" },
//     { className: "suv", classStatus: "ACTIVE" },
//     { className: "swift", classStatus: "ACTIVE" },
//     { className: "thar", classStatus: "ACTIVE" },
//     { className: "tractor", classStatus: "ACTIVE" },
//     { className: "truck", classStatus: "ACTIVE" },
//     { className: "van", classStatus: "ACTIVE" },
//     { className: "woman", classStatus: "ACTIVE" },
//   ];

//   try {
//     // Insert the classes into the database
//     // await prisma.class.createMany({
//     //   data: classes,
//     //   skipDuplicates: true, // Skip any records with duplicate classNames
//     // });

//     await prisma.class.createMany({
//       data: classes,
//       skipDuplicates: true,
//     });

//     res.status(200).json({ message: "Classes inserted successfully." });
//   } catch (error) {
//     console.error("Error inserting classes:", error);
//     res.status(500).json({ message: "Error inserting classes.", error });
//   }
// });

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

router.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
