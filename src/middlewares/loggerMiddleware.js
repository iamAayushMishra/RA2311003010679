import morgan from "morgan";
import logger from "../utils/logger.js";

// Stream morgan output into winston
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Custom token for response time formatting
morgan.token("response-time-ms", (req, res) => {
  const time = morgan["response-time"](req, res);
  return time ? `${time}ms` : "-";
});

// Log: method, url, status, response-time
const loggerMiddleware = morgan(
  ":method :url :status :response-time-ms - :res[content-length]",
  { stream }
);

export default loggerMiddleware;
