import pg from "pg"; // Import the default export from pg
import { getDateRange } from "../../utils/helperFunctions.js";
import {
  detectGarbageService,
  getIncidentsService,
  getSpecificIncidentService,
} from "../services/incidents.service.js";

const { Client } = pg;
let clients = [];
let notificationCount = 0;
let clientCounter = 0;


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false, 
  }, 
});


client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    return client.query("LISTEN new_incident");
  })
  .catch((err) => {
    console.error("Connection error:", err.stack);
  });

// Notify all connected clients
const notifyClients = () => {
  console.log("Notification count",notificationCount)
  clients.forEach((client) => {
    client.res.write(
      `data: ${JSON.stringify({ count: notificationCount })}\n\n`
    );
  });
};

// Handle notifications
client.on("notification", (msg) => {
  
  if (msg.channel === "new_incident") {
    notificationCount++;
    notifyClients(); // Notify all connected clients of new data
  }
});

const incidentNotificationSSE = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  
  const clientId = ++clientCounter;
  const clientObj = { id: clientId, res };
  clients.push(clientObj);
  res.write( `data: ${JSON.stringify({ count: notificationCount })}\n\n`);


  // Clean up when the client disconnects
  req.on("close", () => {
    clients = clients.filter((c) => c.id !== clientId);
  });
};

// Your other functions (getIncidents, getSpecificIncident, etc.) remain unchanged
const garbageDetection = async (req, res) => {
  try {
    const results = await detectGarbageService();
    if (!results || results.length === 0) {
      return res.status(200).send({ message: "No garbage detected" });
    }
    return res.status(200).send({ message: "Garbage detected", data: results });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in detecting garbage" });
  }
};

const getIncidents = async (req, res) => {
  try {
    const { timeframe } = req.params;
    let startDate, endDate;
    if (timeframe) {
      startDate = getDateRange(timeframe).startDate;
      endDate = getDateRange(timeframe).endDate;
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
    console.log(error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

const getSpecificIncident = async (req, res) => {
  try {
    let { incidentType, timeframe } = req.params;
    incidentType = incidentType.toUpperCase();
    let startDate, endDate;
    if (timeframe) {
      startDate = getDateRange(timeframe).startDate;
      endDate = getDateRange(timeframe).endDate;
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
    console.log(error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

export {
  garbageDetection,
  getIncidents,
  getSpecificIncident,
  incidentNotificationSSE,
};
