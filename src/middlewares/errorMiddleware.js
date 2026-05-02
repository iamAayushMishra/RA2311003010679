import logger from "../utils/logger.js";

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a clean JSON response.
 */
const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
