import express from 'express';
const router = express.Router()
import { 
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
 } from './jobs.controller';
import {  protect  } from '../../middleware/auth';

// Public routes
router.get('/', getAllJobs)
router.get('/:id', getJobById)

// Protected routes (require authentication)
router.use(protect)

// HR only routes
router.post('/', createJob) // Only HR can create jobs
router.put('/:id', updateJob) // Creator or HR can update
router.delete('/:id', deleteJob) // Creator or HR can delete

// Any authenticated user can view their own jobs (for HRs)
router.get('/user/my-jobs', getMyJobs)

export default router;