import { logger } from "../utils/index.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
};

export default errorHandler;
