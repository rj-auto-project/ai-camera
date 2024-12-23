import pg from "pg"; // Import the default export from pg
import { getDateRange } from "../../utils/helperFunctions.js";
import dotenv from "dotenv";
import {
  detectGarbageService,
  getGraphIncidents,
  getIncidentsService,
  getPaginatedIncidentsService,
  getSpecificIncidentService,
  markWrongOrRight,
} from "../services/incidents.service.js";

const envFile = process.env.NODE_ENV === "prod" ? `.env.prod` : ".env.dev";
dotenv.config({ path: envFile });

const { Pool } = pg; // Use Pool for connection management
let clients = [];
let notificationCount = 0;
let clientCounter = 0;

// Create a connection pool for efficient reuse of connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Listen for new incidents using LISTEN/NOTIFY
const listenForNotifications = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL, listening for notifications...");

    client.query("LISTEN new_incident");

    client.on("notification", (msg) => {
      if (msg.channel === "new_incident") {
        notificationCount++;
        notifyClients(); // Notify all connected clients of new data
      }
    });

    client.on("error", (err) => {
      console.error("Database error:", err);
      client.release();
      // Reconnect if the client encounters an error
      setTimeout(listenForNotifications, 5000); // Retry after 5 seconds
    });
  } catch (err) {
    console.error("Connection error:", err);
    setTimeout(listenForNotifications, 5000); // Retry after 5 seconds
  }
};

// Notify all connected clients
const notifyClients = () => {
  console.log("Notification count:", notificationCount);
  clients.forEach((client) => {
    client.res.write(
      `data: ${JSON.stringify({ count: notificationCount })}\n\n`
    );
  });
};

// SSE endpoint
const incidentNotificationSSE = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const clientId = ++clientCounter;
  const clientObj = { id: clientId, res };
  clients.push(clientObj);
  res.write(`data: ${JSON.stringify({ count: notificationCount })}\n\n`);

  // Clean up when the client disconnects
  req.on("close", () => {
    clients = clients.filter((c) => c.id !== clientId);
    res.end();
  });
};

// Garbage detection
const garbageDetection = async (req, res) => {
  try {
    const results = await detectGarbageService();
    if (!results || results.length === 0) {
      return res.status(200).send({ message: "No garbage detected" });
    }
    return res.status(200).send({ message: "Garbage detected", data: results });
  } catch (error) {
    console.error("Garbage detection error:", error);
    res.status(500).send({ message: "Error in detecting garbage" });
  }
};

// Get incidents

const markIncidentsWrongOrRight = async (req, res) => {
  try {
    let { id, markWrong } = req.query;
    console.log("id", id, "markWrong", markWrong);
    id = parseInt(id);

    if (!id) {
      return res.status(400).send({ message: "Incident ID is required" });
    } else if (markWrong === undefined) {
      return res.status(400).send({ message: "Mark wrong is required" });
    }

    const result = await markWrongOrRight(id, markWrong === "true");
    if (result) {
      return res.status(200).send({ message: "Incident marked successfully" });
    } else {
      return res.status(400).send({ message: "Error in marking incident" });
    }
  } catch (error) {
    console.error("Error marking incident:", error);
    res.status(500).send({ message: "Error in marking incident" });
  }
};

const paginatedIncidents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "timestamp",
      sortOrder = "desc",
      incidentType,
      cameraId,
      modelResolved,
      userResolved,
      resolved,
      startDate,
      endDate,
      alerts,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Filter conditions
    console.log("incidentType", resolved);
    const filters = {};
    if (incidentType) filters.incidentType = incidentType;
    if (cameraId) filters.cameraId = cameraId;
    if (modelResolved !== undefined)
      filters.modelResolved = modelResolved === "true";
    if (userResolved !== undefined)
      filters.userResolved = userResolved === "true";
    if (resolved !== undefined) filters.resolved = resolved === "true";
    if (alerts) filters.alerts = parseInt(alerts);
    if (resolved === "" || resolved === undefined) delete filters.resolved;

    console.log("filters", filters);
    // Time range filter (startDate and endDate)
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.gte = new Date(startDate);
      if (endDate) filters.timestamp.lte = new Date(endDate);
    }

    // Sorting condition
    const sortCondition = {};
    sortCondition[sortBy] = sortOrder === "asc" ? "asc" : "desc";

    const { incidents, totalIncidents, incidentsTypes, cameras } =
      await getPaginatedIncidentsService(
        offset,
        limitNumber,
        filters, // Pass the filters
        sortCondition // Pass the sorting condition
      );

    res.status(200).send({
      message: "Incidents found",
      data: incidents,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalIncidents / limitNumber),
      totalIncidents,
      incidentsTypes,
      cameras,
    });
  } catch (error) {
    console.error("Error getting incidents:", error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

const getIncidents = async (req, res) => {
  try {
    const { timeframe } = req.params;
    console.log("timeframe", timeframe);
    let startDate, endDate;
    if (timeframe) {
      ({ startDate, endDate } = getDateRange(timeframe)); // Destructure date range
    }

    const incidents = await getIncidentsService(startDate, endDate);
    notificationCount = 0; // Reset notification count when incidents are fetched
    if (!incidents || incidents.length === 0) {
      return res.status(200).send({ message: "No incidents found" });
    }

    return res
      .status(200)
      .send({ message: "Incidents found", data: incidents });
  } catch (error) {
    console.error("Error getting incidents:", error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

// Get specific incident
const getSpecificIncident = async (req, res) => {
  try {
    let { incidentType, timeframe } = req.params;
    incidentType = incidentType.toUpperCase();
    let startDate, endDate;
    if (timeframe) {
      ({ startDate, endDate } = getDateRange(timeframe)); // Destructure date range
    }

    const incidents = await getSpecificIncidentService(
      incidentType,
      startDate,
      endDate
    );

    if (!incidents || incidents.length === 0) {
      return res
        .status(200)
        .send({ message: `No ${incidentType} incidents found` });
    }

    return res
      .status(200)
      .send({ message: `${incidentType} incidents found`, data: incidents });
  } catch (error) {
    console.error("Error getting specific incident:", error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

const getDetectedVsSolved = async (req, res) => {
  const { timeframe } = req.params;
  try {
    const formattedData = await getGraphIncidents(timeframe);
    res.json(formattedData);
  } catch (error) {
    console.error("Error in getDetectedVsSolved controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Start listening for notifications immediately
listenForNotifications();

export {
  garbageDetection,
  getIncidents,
  getSpecificIncident,
  incidentNotificationSSE,
  paginatedIncidents,
  markIncidentsWrongOrRight,
  getDetectedVsSolved,
};
