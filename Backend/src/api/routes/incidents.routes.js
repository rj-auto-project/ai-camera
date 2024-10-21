import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  getDetectedVsSolved,
  getIncidents,
  getSpecificIncident,
  incidentNotificationSSE,
  markIncidentsWrongOrRight,
} from "../controllers/incidents.controller.js";

const router = express.Router();

// Define the more specific routes first
router.get("/detectedvssolved/:timeframe", authMiddleware, getDetectedVsSolved);
router.get("/notifications/sse", incidentNotificationSSE);
router.get("/:timeframe?", authMiddleware, getIncidents);
router.get(
  "/specific/:incidentType/:timeframe?",
  authMiddleware,
  getSpecificIncident
);
router.put("/mark-incidents", authMiddleware, markIncidentsWrongOrRight);

// Get the status of map route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
