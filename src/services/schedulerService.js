import { getDepots, getVehiclesByDepot } from "./fetchService.js";
import { solveKnapsack } from "./knapsackService.js";
import logger from "../utils/logger.js";

/**
 * Main scheduling pipeline:
 *   1. Fetch all depots
 *   2. For each depot, fetch its vehicles (maintenance tasks)
 *   3. Run 0/1 Knapsack to select optimal tasks within MechanicHours
 *   4. Aggregate and return results
 *
 * Uses Promise.all for parallel depot processing.
 *
 * @returns {Promise<Array>} Array of per-depot scheduling results
 */
export async function generateSchedule() {
  logger.info("=== Starting schedule generation ===");

  // Step 1: Fetch all depots
  const depots = await getDepots();

  if (!depots || depots.length === 0) {
    logger.warn("No depots found — returning empty schedule");
    return [];
  }

  // Step 2 & 3: Process each depot in parallel
  const results = await Promise.all(
    depots.map(async (depot) => {
      try {
        const { ID: depotId, MechanicHours: capacity } = depot;

        // Fetch vehicles/tasks for this depot
        const vehicles = await getVehiclesByDepot(depotId);

        if (!vehicles || vehicles.length === 0) {
          logger.warn(`Depot ${depotId}: no vehicles found — returning empty`);
          return {
            depotId,
            totalDuration: 0,
            totalImpact: 0,
            selectedTasks: [],
          };
        }

        // Build tasks array from vehicles
        // Each vehicle represents a maintenance task with TaskID, Duration, Impact
        const tasks = vehicles.map((v) => ({
          TaskID: v.TaskID || v.VehicleID || v.ID,
          Duration: v.Duration || v.ServiceTime || 0,
          Impact: v.Impact || v.Priority || 0,
        }));

        // Run knapsack optimization
        const { selectedTasks, totalImpact, totalDuration } = solveKnapsack(tasks, capacity);

        return {
          depotId,
          totalDuration,
          totalImpact,
          selectedTasks,
        };
      } catch (error) {
        logger.error(`Error processing depot ${depot.ID}: ${error.message}`);
        return {
          depotId: depot.ID,
          totalDuration: 0,
          totalImpact: 0,
          selectedTasks: [],
          error: error.message,
        };
      }
    })
  );

  logger.info(`=== Schedule generation complete: ${results.length} depots processed ===`);
  return results;
}
