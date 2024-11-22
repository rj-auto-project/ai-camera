import { getSurveysAnalyticsService } from "../services/surveys.service.js";

const getSurveysAnalytics = async (req, res) => {
    try {
        const analytics = await getSurveysAnalyticsService();
        res.status(200).json({ status: 'success', data: analytics || "No data found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
}

export {  getSurveysAnalytics };