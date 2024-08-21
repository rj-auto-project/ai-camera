import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { operationValidator } from "../validators/map.validator.js";
import upload from "../../utils/imageUpload.js";
import { faceDetection } from "../controllers/operations.controller.js";

const router = express.Router();

router.post("/face-detection", authMiddleware, upload.array('images', 4), faceDetection)

// Get the status of operations route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
