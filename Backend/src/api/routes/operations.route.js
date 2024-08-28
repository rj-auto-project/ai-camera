import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { operationValidator } from "../validators/map.validator.js";
import { upload } from "../../utils/index.js";
import {
  suspectSearch,
  vehicleOperation,
  getOperations,
  liveVehicleOperation,
} from "../controllers/operations.controller.js";

const router = express.Router();

router.post("/suspect-search", authMiddleware, suspectSearch);
router.post("/vehicle-op", authMiddleware, vehicleOperation);
router.get("/vehicle-op", authMiddleware, liveVehicleOperation);
router.get("/", authMiddleware, getOperations);

// Get the status of operations route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
