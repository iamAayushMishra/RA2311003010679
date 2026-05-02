import axios from "axios";
import logger from "../utils/logger.js";

/**
 * Lazily create a pre-configured axios instance with auth headers.
 * This ensures env vars are available (dotenv must load before first call).
 */
let _apiClient = null;

function getApiClient() {
  if (!_apiClient) {
    const baseURL = process.env.API_BASE_URL;
    const token = process.env.ACCESS_TOKEN;

    if (!baseURL) throw new Error("API_BASE_URL is not configured in .env");
    if (!token) throw new Error("ACCESS_TOKEN is not configured in .env");

    _apiClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    logger.info(`API client configured: ${baseURL}`);
  }
  return _apiClient;
}

/**
 * Fetch all depots from the external API.
 * @returns {Promise<Array>} Array of depot objects { ID, MechanicHours }
 */
export async function getDepots() {
  try {
    logger.info("Fetching depots from external API...");
    const response = await getApiClient().get("/vehicles/depots");
    const depots = response.data.depots || [];
    logger.info(`Fetched ${depots.length} depots successfully`);
    return depots;
  } catch (error) {
    logger.error(`Failed to fetch depots: ${error.message}`);
    throw new Error(`External API error (depots): ${error.message}`);
  }
}

/**
 * Fetch all vehicles for a specific depot.
 * @param {number} depotId - The depot ID
 * @returns {Promise<Array>} Array of vehicle/task objects
 */
export async function getVehiclesByDepot(depotId) {
  try {
    logger.info(`Fetching vehicles for depot ${depotId}...`);
    const response = await getApiClient().get(`/vehicles/depot/${depotId}`);
    const vehicles = response.data.vehicles || [];
    logger.info(`Fetched ${vehicles.length} vehicles for depot ${depotId}`);
    return vehicles;
  } catch (error) {
    logger.error(`Failed to fetch vehicles for depot ${depotId}: ${error.message}`);
    throw new Error(`External API error (vehicles for depot ${depotId}): ${error.message}`);
  }
}
