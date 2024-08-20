import { getCamerasFormap } from "../services/map.services.js";

const getCamerars = async (req, res, next) => {
  try {
    const cameras = await getCamerasFormap();
    res.status(200).json(cameras);
  } catch (error) {
    next(error);
  }
};

export { getCamerars };
