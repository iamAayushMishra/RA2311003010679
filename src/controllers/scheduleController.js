import { generateSchedule } from "../services/schedulerService.js";
import logger from "../utils/logger.js";

/**
 * POST /schedule
 * Triggers the scheduling pipeline and returns optimized results.
 */
export async function scheduleHandler(req, res, next) {
  try {
    logger.info("POST /schedule — request received");

    const results = await generateSchedule();

    res.status(200).json({ results });
  } catch (error) {
    next(error);
  }
}
