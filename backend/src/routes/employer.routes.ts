import { Router } from "express";
import {
  createEmployerProfile,
  getEmployerProfile,
  updateEmployerProfile,
} from "../controllers/employer.controller";
import { protect, protectEmployer } from "../middleware/protectedRoute";
import { updateApplicationStatus } from "../controllers/application.controller";

const router = Router();

router.post("/profile", protect, createEmployerProfile);
router.get("/profile", protectEmployer, getEmployerProfile);
router.put("/profile", protectEmployer, updateEmployerProfile);

export default router;
