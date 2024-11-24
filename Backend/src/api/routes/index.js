import express from "express";

import authRoutes from "./auth.routes.js";
import mapRoutes from "./map.routes.js";
import operationsRoutes from "./operations.route.js";
import incidentsRoutes from "./incidents.routes.js";
import adminRoutes from "./admin.routes.js";
import settingRoutes from "./settings.routes.js";
import surveyRoutes from "./survey.routes.js";

import authMiddleware from "../../middleware/authMiddleware.js";
import { getClassList, getObjectTypes } from "../../utils/helperFunctions.js";
import {
  garbageDetection,
  paginatedIncidents,
} from "../controllers/incidents.controller.js";
import { getEventNotifications } from "../controllers/events.controller.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/map", mapRoutes);
router.use("/operations", operationsRoutes);
router.use("/incidents", incidentsRoutes);
router.get("/incidentspaginated", authMiddleware, paginatedIncidents);

router.use("/admin", adminRoutes);
router.use("/settings", settingRoutes);
router.use("/survey", surveyRoutes);

router.get("/objectTypes", authMiddleware, getObjectTypes);
router.get("/classlist", authMiddleware, getClassList);
router.get("/garbagedata", authMiddleware, garbageDetection);

router.get("/events", authMiddleware, getEventNotifications);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

router.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
