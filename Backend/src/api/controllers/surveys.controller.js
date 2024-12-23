import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

import { getPaginatedSurveysService, getSurveyReportsPDFService, getSurveyReportsService, getSurveysAnalyticsService } from "../services/surveys.service.js";
import { getLocationFromCoordinates } from "../../utils/reverseGeo.js";
import fetchImageBuffer from "../../utils/imageBuffer.js";
import convertImage from "../../utils/convertImage .js";

const thumbnailUrl = process.env.IMAGE_BASE_URL
console.log("thumbnailUrl", thumbnailUrl);

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

const getSurveyReportsExcel = async (req, res) => {
  console.log("getSurveyReportsExcel");
  try {
    let { surveyId } = req.query;
    surveyId = parseInt(surveyId);
    if (!surveyId) {
      return res.status(400).json({ status: 'fail', message: 'Survey ID is required' });
    }

    const { surveyReports, finalDestination, initialDestination } = await getSurveyReportsPDFService(surveyId);

    if (!surveyReports || surveyReports.length === 0) {
      return res.status(200).json({ status: 'success', message: 'No data found' });
    }

    const data = [
      ['Survey Title', surveyReports[0].survey.surveyName],
      ['Type of Survey', surveyReports[0].survey.type === 'ROAD_DEFECTS' ? 'Road Defects' : 'Road Furniture'],
      ['Total Reports', surveyReports.length],
      ['Survey Date', new Date(surveyReports[0].survey.date).toLocaleString()],
      ['Survey Location', `${initialDestination} to ${finalDestination}`],
      [],
      ['Object Detected', 'Distance Covered', 'Coordinates', 'Thumbnail'],
    ];

    // Initialize a new workbook
    const workbook = await XLSXPopulate.fromBlankAsync();

    // Add data rows
    let rowIndex = 1;
    data.forEach((row) => {
      row.forEach((cell, colIndex) => {
        workbook.sheet(0).cell(rowIndex, colIndex + 1).value(cell);
      });
      rowIndex++;
    });

    // Add survey report rows with images
    for (const report of surveyReports) {
      workbook.sheet(0).cell(rowIndex, 1).value(report.className || 'N/A');
      workbook.sheet(0).cell(rowIndex, 2).value(report.distance ? `${report.distance} km` : 'N/A');
      workbook.sheet(0).cell(rowIndex, 3).value(JSON.stringify(report.address || {}, null, 2));

      // Fetch the image and insert it
      const imageUrl = report.thumbnail || 'https://placehold.co/600x400';
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(response.data, 'binary');

        const imageCell = workbook.sheet(0).cell(rowIndex, 4);
        workbook.addImage({
          image: imageData,
          type: 'image/png', // Adjust type as needed (e.g., 'image/jpeg')
          position: {
            sheet: workbook.sheet(0),
            cell: imageCell,
          },
        });
      } catch (err) {
        console.error(`Error fetching image: ${imageUrl}`, err);
        workbook.sheet(0).cell(rowIndex, 4).value('Image not available');
      }

      rowIndex++;
    }

    // Save the workbook to a temporary file
    const tempFilePath = path.join(__dirname, `../../../temp/survey-${surveyId}-${Date.now()}.xlsx`);
    await workbook.toFileAsync(tempFilePath);

    console.log("tempFilePath", tempFilePath);

    // Set response headers and send the file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.download(tempFilePath, `survey-${surveyId}.xlsx`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({ status: 'fail', message: 'Error sending file' });
      }

      // Clean up temporary file
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

const getSurveyReportsPDF = async (req, res) => {
  console.log("getSurveyReportsPDF");
  try {
    let { surveyId } = req.query;
    surveyId = parseInt(surveyId);
    if (!surveyId) {
      return res.status(400).json({ status: 'fail', message: 'Survey ID is required' });
    }

    const { surveyReports, finalDestination, initialDestination, surveyReportsByClasses } = await getSurveyReportsPDFService(surveyId);

    if (!surveyReports || surveyReports.length === 0) {
      return res.status(200).json({ status: 'success', message: 'No data found' });
    }

    const htmlContent = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      h1, h2, h3 {
        text-align: center;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f4f4f4;
      }
      img {
        width: 100px;
        height: auto;
      }
      .analytics-section {
        margin-top: 40px;
        padding: 20px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
      }
      .analytics-section h2 {
        margin-bottom: 20px;
      }
      .analytics-card {
        display: inline-block;
        width: 30%;
        margin: 10px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .analytics-card h3 {
        margin: 0;
        font-size: 20px;
        color: #333;
      }
      .analytics-card p {
        margin: 5px 0 0;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>Survey Report</h1>
    <h2>${surveyReports[0].survey.surveyName}</h2>
    <h3>${surveyReports[0].survey.type === 'ROAD_DEFECTS' ? 'Road Defects' : 'Road Furniture'}</h3>
    <p>Total Reports: ${surveyReports.length}</p>
    <p>Survey Date: ${new Date(surveyReports[0].survey.date).toLocaleString()}</p>
    <p>Survey Location: ${initialDestination} to ${finalDestination}</p>

    <table>
      <thead>
        <tr>
          <th>Object Detected</th>
          <th>Distance Covered</th>
          <th>Coordinates</th>
          <th>Thumbnail</th>
        </tr>
      </thead>
<tbody>
  ${surveyReports
    .map((report) => {
      const locationUrl = report.location
        ? `<a href="https://www.google.com/maps?q=${report.location[0]},${report.location[1]}" target="_blank">View</a>`
        : 'N/A';
      return `
        <tr>
          <td>${report.className || 'N/A'}</td>
          <td>${report.distance ? `${report.distance} km` : 'N/A'}</td>
          <td>${report.location[0]}, ${report.location[1]} <br/> ${locationUrl}</td>
          <td>
            <a href="${thumbnailUrl}/${report.thumbnail}" target="_blank">
              <img src="${thumbnailUrl}/${report.thumbnail}" alt="Thumbnail">
            </a>
          </td>
        </tr>
      `;
    })
    .join('')}
</tbody>

    </table>

    <div class="analytics-section">
      <h2>Analytics</h2>
      <div class="analytics-card">
        <h3>${surveyReports.length}</h3>
        <p>Total Reports</p>
      </div>
      <div class="analytics-card">
        <h3>${(surveyReports.reduce((sum, report) => sum + (report.distance || 0), 0)).toFixed(2)} km</h3>
        <p>Total Distance Covered</p>
      </div>
    </div>

    <div class="analytics-section">
      <h2>Detections</h2>
      ${surveyReportsByClasses.map((object) => 
        `<div class="analytics-card">
        <h3>${object._count.className}</h3>
        <p>${object.className}</p>
      </div>`)}
    </div>
  </body>
  </html>
`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });


    const tempFilePath = path.join(__dirname, `../../../temp/survey-${surveyId}-${Date.now()}.pdf`);
    await page.pdf({ path: tempFilePath, format: 'A4', printBackground: true });

    await browser.close();

    console.log("tempFilePath", tempFilePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.download(tempFilePath, `survey-${surveyId}-${Date.now()}.pdf`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({ status: 'fail', message: 'Error sending file' });
      }
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export { getSurveysAnalytics, getPaginatedSurveys, getSurveyReportsBySurveyId, getSurveyReportsExcel, getSurveyReportsPDF };