import { Router } from 'express'
import { protectEmployer, protectUser } from '../middleware/protectedRoute'
import { applyJob, getAllApplicantsForEmployerJobs, getUserApplication, updateApplicationStatus} from '../controllers/application.controller'

const router = Router()

router.post("/:jobId/apply" , protectUser , applyJob)
router.get('/' , protectUser , getUserApplication)
router.get('/all-applicants' , protectEmployer , getAllApplicantsForEmployerJobs)
router.put('/:applicationId/status' , protectEmployer , updateApplicationStatus)

export default router;