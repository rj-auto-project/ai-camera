import express from "express";

import authMiddleware from "../../middleware/authMiddleware.js";
import { getSurveysAnalytics } from "../controllers/surveys.controller.js";

const router = express.Router();

router.get("/analytics", authMiddleware, getSurveysAnalytics);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
