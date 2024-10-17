import pg from "pg"; // Import the default export from pg
import { getDateRange } from "../../utils/helperFunctions.js";
import {
  detectGarbageService,
  getIncidentsService,
  getPaginatedIncidentsService,
  getSpecificIncidentService,
} from "../services/incidents.service.js";

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
      `data: ${JSON.stringify({ count: notificationCount })}\n\n`,
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

const paginatedIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = pageNumber * limitNumber;

    const { incidents, totalIncidents } = await getPaginatedIncidentsService(
      offset,
      limitNumber,
    );

    res.status(200).send({
      message: "Incidents found",
      data: incidents,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalIncidents / limitNumber),
      totalIncidents,
    });
  } catch (error) {
    console.error("Error getting incidents:", error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

const getIncidents = async (req, res) => {
  try {
    const { timeframe } = req.params;
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
      endDate,
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

// Start listening for notifications immediately
listenForNotifications();

export {
  garbageDetection,
  getIncidents,
  getSpecificIncident,
  incidentNotificationSSE,
  paginatedIncidents,
};
