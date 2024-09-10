import { getCamerasFormap, getHeatmap } from "../services/map.services.js";

const getCamerars = async (req, res, next) => {
  try {
    const cameras = await getCamerasFormap();
    res.status(200).json(cameras);
  } catch (error) {
    next(error);
  }
};

const performRequestedOperation = async (req, res, next) => {
  try {
    const result = await performOperation(req.body);
    res.status(200).json({ status: "ok", result });
  } catch (error) {
    next(error);
  }
};

const heatmap = async (req, res) => {
  try {
    const heatmap = await getHeatmap();
    res.status(200).json(heatmap);
  } catch (error) {
    console.log("Error sending data");
    res.status(500).json({ message: "Error sending data", error });
  }
};

export { getCamerars, performRequestedOperation, heatmap };
