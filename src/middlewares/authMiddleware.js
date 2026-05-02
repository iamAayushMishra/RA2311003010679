import logger from "../utils/logger.js";

/**
 * Dummy authentication middleware.
 * In production, this would validate JWT tokens or API keys.
 * Currently passes all requests through.
 */
const authMiddleware = (req, res, next) => {
  // Placeholder: validate token here in production
  // const token = req.headers.authorization;
  // if (!token) return res.status(401).json({ error: "Unauthorized" });

  logger.debug("Auth middleware: request authorized");
  next();
};

export default authMiddleware;
