import { Router } from 'express'
import { protectEmployer, protect } from '../middleware/protectedRoute'
import { 
  createJob, 
  getJobs, 
  getJobById, 
  getEmployerJobs, 
  updateJob, 
  deleteJob 
} from '../controllers/job.controller'

const router = Router()

// Public routes (anyone can view jobs)
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes (employer only)
router.post("/", protectEmployer, createJob);
router.get("/employer/jobs", protectEmployer, getEmployerJobs);
router.put("/:id", protectEmployer, updateJob);
router.delete("/:id", protectEmployer, deleteJob);

export default router;