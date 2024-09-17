import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { operationValidator } from "../validators/map.validator.js";
import { upload } from "../../utils/index.js";
import {
  suspectSearch,
  vehicleOperation,
  getOperations,
  liveVehicleOperation,
  liveSuspectSearch,
  liveIncidentsTracking,
} from "../controllers/operations.controller.js";

const router = express.Router();

router.post("/suspect-search", suspectSearch);
router.get("/suspect-search/live", liveSuspectSearch);
router.post("/vehicle", vehicleOperation);
router.get("/vehicle/live", liveVehicleOperation);
router.post("/", getOperations);
router.get("/incidents/live", liveIncidentsTracking);

// Get the status of operations route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
