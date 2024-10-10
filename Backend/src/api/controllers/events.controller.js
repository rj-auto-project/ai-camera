import { consumeMessages } from "../../config/kafkaConfig.js";

const getEventNotifications = async (req, res) => {
  console.log("getEventNotifications");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  consumeMessages("incident-logs", (message) => {
    res.write(`data: ${message}\n\n`);
  });
};

export { getEventNotifications };
