import express from "express";

import authMiddleware from "../../middleware/authMiddleware.js";
import { getPaginatedSurveys, getSurveyReportsBySurveyId, getSurveyReportsExcel, getSurveysAnalytics } from "../controllers/surveys.controller.js";

const router = express.Router();

router.get("/analytics", authMiddleware, getSurveysAnalytics);
router.get("/all", authMiddleware, getPaginatedSurveys);
router.get("/reports/:id", authMiddleware, getSurveyReportsBySurveyId);
router.get("/report/download", authMiddleware, getSurveyReportsExcel);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
