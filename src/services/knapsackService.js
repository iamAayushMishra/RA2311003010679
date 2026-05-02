import logger from "../utils/logger.js";

/**
 * 0/1 Knapsack using Dynamic Programming with backtracking.
 *
 * Given a set of maintenance tasks (each with a Duration and Impact),
 * and a capacity (MechanicHours), select the subset of tasks that
 * maximizes total Impact without exceeding the capacity.
 *
 * Algorithm:
 *   - 1D DP array where dp[w] = max impact achievable with capacity w
 *   - 2D decision array to track which tasks were selected (for backtracking)
 *   - Time:  O(n × capacity)
 *   - Space: O(n × capacity) due to decision tracking
 *
 * @param {Array} tasks   - Array of { TaskID, Duration, Impact }
 * @param {number} capacity - Total mechanic hours available
 * @returns {{ selectedTasks: string[], totalImpact: number, totalDuration: number }}
 */
export function solveKnapsack(tasks, capacity) {
  // Edge case: no tasks or zero capacity
  if (!tasks || tasks.length === 0 || capacity <= 0) {
    logger.info("Knapsack: no valid tasks or zero capacity — returning empty");
    return { selectedTasks: [], totalImpact: 0, totalDuration: 0 };
  }

  // Filter out invalid tasks: skip if duration > capacity or impact <= 0
  const validTasks = tasks.filter((task) => {
    if (task.Duration > capacity) {
      logger.debug(`Knapsack: skipping task ${task.TaskID} — duration ${task.Duration} exceeds capacity ${capacity}`);
      return false;
    }
    if (!task.Impact || task.Impact <= 0) {
      logger.debug(`Knapsack: skipping task ${task.TaskID} — impact is 0 or negative`);
      return false;
    }
    return true;
  });

  if (validTasks.length === 0) {
    logger.info("Knapsack: all tasks filtered out — returning empty");
    return { selectedTasks: [], totalImpact: 0, totalDuration: 0 };
  }

  const n = validTasks.length;

  // dp[w] = maximum impact achievable with capacity w
  const dp = new Array(capacity + 1).fill(0);

  // keep[i][w] = true if task i was included in optimal solution for capacity w
  // This is needed for backtracking to recover the selected tasks
  const keep = Array.from({ length: n }, () => new Array(capacity + 1).fill(false));

  // Fill the DP table (iterate in reverse to ensure 0/1 property)
  for (let i = 0; i < n; i++) {
    const { Duration: duration, Impact: impact } = validTasks[i];

    for (let w = capacity; w >= duration; w--) {
      if (dp[w - duration] + impact > dp[w]) {
        dp[w] = dp[w - duration] + impact;
        keep[i][w] = true;
      }
    }
  }

  // Backtracking: recover which tasks were selected
  const selectedTasks = [];
  let totalDuration = 0;
  let remainingCapacity = capacity;

  for (let i = n - 1; i >= 0; i--) {
    if (keep[i][remainingCapacity]) {
      selectedTasks.push(validTasks[i].TaskID);
      totalDuration += validTasks[i].Duration;
      remainingCapacity -= validTasks[i].Duration;
    }
  }

  const totalImpact = dp[capacity];

  logger.info(
    `Knapsack solved: ${selectedTasks.length} tasks selected, ` +
    `totalImpact=${totalImpact}, totalDuration=${totalDuration}/${capacity}`
  );

  return {
    selectedTasks,
    totalImpact,
    totalDuration,
  };
}
