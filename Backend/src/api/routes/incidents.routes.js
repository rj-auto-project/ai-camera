import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  getIncidents,
  getSpecificIncident,
} from "../controllers/incidents.controller.js";

const router = express.Router();

// router.get("/:timeframe?", authMiddleware, getIncidents);
// router.get(
//   "/specific/:incidentType/:timeframe?",
//   authMiddleware,
//   getSpecificIncident,
// );

router.get("/", authMiddleware, getIncidents);

// Get the status of map route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
