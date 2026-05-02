import { Router } from "express";
import { scheduleHandler } from "../controllers/scheduleController.js";

const router = Router();

// POST /schedule — run the maintenance scheduling optimization
router.post("/", scheduleHandler);

export default router;
