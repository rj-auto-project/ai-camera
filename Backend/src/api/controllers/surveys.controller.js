import { getSurveysAnalyticsService } from "../services/surveys.service.js";

const getSurveysAnalytics = async (req, res) => {
  try {
    const analytics = await getSurveysAnalyticsService();
    if (analytics.totalSurveys === 0) {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }
    return res.status(200).json({ status: "success", data: analytics });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};

export { getSurveysAnalytics };
