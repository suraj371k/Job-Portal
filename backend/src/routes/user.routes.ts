import { Router } from "express";
import { createUserProfile, getUserProfile, uploadResume, updateUserProfile } from "../controllers/user.controller";
import { protectUser } from "../middleware/protectedRoute";
import { uploadResume as uploadResumeMiddleware } from "../middleware/uploadResume";

const router = Router();

// Create user profile
router.post("/profile/me", protectUser, createUserProfile);

// Upload resume
router.post(
  "/profile/resume",
  protectUser,
  uploadResumeMiddleware.single("resume"),
  uploadResume
);

// Get user profile
router.get("/profile/me", protectUser, getUserProfile);

// Update user profile
router.put("/profile/me", protectUser, updateUserProfile);

export default router;
