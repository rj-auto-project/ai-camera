import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  getIncidents,
  getSpecificIncident,
  incidentNotificationSSE,
  markIncidentsWrongOrRight,
} from "../controllers/incidents.controller.js";

const router = express.Router();

router.get("/:timeframe?", authMiddleware, getIncidents);
router.get(
  "/specific/:incidentType/:timeframe?",
  authMiddleware,
  getSpecificIncident
);
router.put("/mark-incidents", authMiddleware, markIncidentsWrongOrRight);
router.get("/notifications/sse", incidentNotificationSSE);
// Get the status of map route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
