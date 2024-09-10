import { detectGarbageService } from "../services/incidents.service.js";

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

export { garbageDetection };
