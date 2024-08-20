import express from "express";
import {
  getCamerars,
  performRequestedOperation,
} from "../controllers/map.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { operationValidator } from "../validators/map.validator.js";
// import {
//   registerValidator,
//   loginValidator,
// } from "../validators/auth.validator.js";

const router = express.Router();

router.get("/cameras", authMiddleware, getCamerars);
router.post(
  "/operation",
  authMiddleware,
  operationValidator,
  performRequestedOperation,
);

// Get the status of map route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
