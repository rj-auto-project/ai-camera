import { getCamerasFormap } from "../services/map.services.js";

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

export { getCamerars, performRequestedOperation };
