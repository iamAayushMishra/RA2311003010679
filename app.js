import express from "express";
import dotenv from "dotenv";

// Load environment variables BEFORE anything else
dotenv.config();

import loggerMiddleware from "./src/middlewares/loggerMiddleware.js";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";
import scheduleRoutes from "./src/routes/scheduleRoutes.js";
import logger from "./src/utils/logger.js";

const app = express();

// --- Middleware Pipeline ---
// 1. Parse JSON request bodies
app.use(express.json());

// 2. HTTP request logging (morgan → winston)
app.use(loggerMiddleware);

// 3. Auth check (dummy — passes all requests)
app.use(authMiddleware);

// --- Routes ---
app.use("/schedule", scheduleRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    service: "Vehicle Maintenance Scheduler",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// --- Global Error Handler (must be LAST) ---
app.use(errorMiddleware);

export default app;
