import express from "express";

import authRoutes from "./auth.routes.js";
import mapRoutes from "./map.routes.js";
import operationsRoutes from "./operations.route.js";
import incidentsRoutes from "./incidents.routes.js";
import adminRoutes from "./admin.routes.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import { getClassList, getObjectTypes } from "../../utils/helperFunctions.js";
import { garbageDetection } from "../controllers/incidents.controller.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/map", mapRoutes);
router.use("/operations", operationsRoutes);
router.use("/incidents", incidentsRoutes);
router.use("/admin", adminRoutes);

router.get("/objectTypes", getObjectTypes);
router.get("/classlist", getClassList);
router.get("/garbagedata", garbageDetection);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

router.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
