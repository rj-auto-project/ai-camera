import express from "express";
import {
  getCamerars,
  heatmap,
  performRequestedOperation,
} from "../controllers/map.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { operationValidator } from "../validators/map.validator.js";
// import {
//   registerValidator,
//   loginValidator,
// } from "../validators/auth.validator.js";

const router = express.Router();

router.get("/cameras", getCamerars);
router.post(
  "/operation",
  operationValidator,
  performRequestedOperation,
);
router.get("/heatmap", heatmap);

// Get the status of map route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
