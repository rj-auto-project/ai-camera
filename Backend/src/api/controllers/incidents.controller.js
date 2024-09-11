import { getDateRange } from "../../utils/helperFunctions.js";
import {
  detectGarbageService,
  getIncidentsService,
  getSpecificIncidentService,
} from "../services/incidents.service.js";

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
    console.log(error);
    res.status(500).send({ message: "Error in getting incidents" });
  }
};

export { garbageDetection, getIncidents, getSpecificIncident };
