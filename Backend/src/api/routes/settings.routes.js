import express from "express";
import {
  addCamera,
  getAllCameras,
  getCamera,
  updateCamera,
} from "../controllers/settings.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cameras", authMiddleware, addCamera);
router.get("/cameras/:id", authMiddleware, getCamera);
router.put("/cameras/:id", authMiddleware, updateCamera);
router.get("/cameras", authMiddleware, getAllCameras);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
