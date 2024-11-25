import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

import { getPaginatedSurveysService, getSurveyReportsPDFService, getSurveyReportsService, getSurveysAnalyticsService } from "../services/surveys.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const getSurveyReportsBySurveyId = async (req, res) => {
  try {
    let surveyId = req.params.id;
    if (!surveyId) {
      return res.status(400).json({ status: "fail", message: "Survey ID is required" });
    }
    surveyId = parseInt(surveyId);
    const surveyReports = await getSurveyReportsService(surveyId);
    if (surveyReports.length === 0) {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }
    return res.status(200).json({ status: "success", data: surveyReports });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
}

const getSurveyReportsPDF = async (req, res) => {
  try {
    let { surveyId } = req.query;
    surveyId = parseInt(surveyId);
    if (!surveyId) {
      return res.status(400).json({ status: "fail", message: "Survey ID is required" });
    }

    const surveyReportsPdf = await getSurveyReportsPDFService(surveyId);

    if (!surveyReportsPdf || surveyReportsPdf.length === 0) {
      return res.status(200).json({ status: "success", message: "No data found" });
    }

    const doc = new PDFDocument();
    const tempFilePath = path.join(__dirname, `../../../temp/survey-${surveyId}-${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(tempFilePath);
    doc.pipe(writeStream);

    doc.fontSize(20).font('Times-Bold').text('Survey Report', {
      align: 'center',
      underline: true,
    });
    doc.moveDown(2);

    for (const report of surveyReportsPdf) {
      // Add a separator line between reports for clarity
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke('#cccccc')
        .moveDown(1);

      // Add survey name and type in bold with friendly labels
      doc.fontSize(16).font('Times-Bold').text(`Survey Title: ${report.survey.surveyName}`, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Times-Roman').text(`Type of Survey: ${report.survey.type === 'ROAD_DEFECTS' ? 'Road Defects' : 'Road Furniture'}`);
      doc.moveDown(1);

      // Object type and distance details
      doc
        .fontSize(12)
        .font('Times-Bold')
        .text(`Object Detected:`, { continued: true })
        .font('Times-Roman')
        .text(` ${report.className}`);

      doc
        .font('Times-Bold')
        .text(`Distance Covered:`, { continued: true })
        .font('Times-Roman')
        .text(` ${report.distance ? `${report.distance} km` : 'N/A'}`);

      doc.moveDown(0.5);

      // Date and location details
      doc
        .font('Times-Bold')
        .text(`Survey Date:`, { continued: true })
        .font('Times-Roman')
        .text(` ${new Date(report.survey.date).toLocaleString()}`);

      doc.moveDown(0.5);

      doc
        .font('Times-Bold')
        .text(`Survey Location Coordinates:`, { continued: true })
        .font('Times-Roman')
        .text(` ${JSON.stringify(report.location || {}, null, 2)}`);
      doc.moveDown(1);

      // Add the thumbnail with borders and caption
      if (fs.existsSync(report.thumbnail)) {
        doc
          .rect(doc.x, doc.y, 150, 100)
          .stroke('#cccccc'); // Draw a border around the image
        doc.image(report.thumbnail, {
          fit: [150, 100],
          align: 'center',
          valign: 'center',
        });
        doc.fontSize(10).font('Times-Italic').text('Thumbnail of the Object', { align: 'center' });
      } else {
        doc.font('Times-Italic').text('(Thumbnail not available)', { align: 'center' });
      }

      doc.moveDown(2);
    }

    // Finalize the document
    doc.end();


    writeStream.on("finish", () => {
      res.download(tempFilePath, `survey-${surveyId}-${Date.now()}.pdf`, (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error("Error deleting temp file:", err);
          }
        });
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing temp file:", err);
      return res.status(500).json({ status: "fail", message: "Internal server error" });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};

export { getSurveysAnalytics, getPaginatedSurveys, getSurveyReportsBySurveyId, getSurveyReportsPDF };