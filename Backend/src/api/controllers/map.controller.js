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

const heatmap = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let lastSentData = {};

  const sendHeatmapData = async () => {
    try {
      const heatmap = await getHeatmap();

      if (JSON.stringify(heatmap) === JSON.stringify(lastSentData)) {
        return;
      }

      if (heatmap.length > 0) {
        lastSentData = heatmap;
        res.write(`data: ${JSON.stringify(heatmap)}\n\n`);
      }
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      res.write(
        `data: ${JSON.stringify({ message: "Error fetching data" })}\n\n`,
      );
    }
  };

  sendHeatmapData();
  const intervalId = setInterval(sendHeatmapData, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

export { getCamerars, performRequestedOperation, heatmap };
