import { getPaginatedSurveysService, getSurveysAnalyticsService } from "../services/surveys.service.js";

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

const getPaginatedSurveys = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const surveys = await getPaginatedSurveysService(offset, limit);

    if (surveys.length === 0) {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }

    return res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(surveys.length / limit),
      totalSurveys: surveys.length,
      data: surveys,
    })
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
}

export { getSurveysAnalytics, getPaginatedSurveys };
