import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { operationValidator } from "../validators/map.validator.js";
import { upload } from "../../utils/index.js";
import {
  getClassList,
  suspectSearch,
  anprOperation,
} from "../controllers/operations.controller.js";

const router = express.Router();

// router.post(
//   "/face-detection",
//   authMiddleware,
//   upload.array("images", 4),
//   faceDetection,
// );
router.get("/classlist", authMiddleware, getClassList);
router.post("/suspect-search", authMiddleware, suspectSearch);
router.post("/anpr", authMiddleware, anprOperation);

// Get the status of operations route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;