import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  getIncidents,
  getSpecificIncident,
} from "../controllers/incidents.controller.js";

const router = express.Router();

router.get("/:timeframe?", getIncidents);
router.get(
  "/specific/:incidentType/:timeframe?",
  getSpecificIncident,
);

// Get the status of map route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;