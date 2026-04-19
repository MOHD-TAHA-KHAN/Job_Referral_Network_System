const express = require('express')
const router = express.Router()
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} = require('./jobs.controller')
const { protect } = require('../../middleware/auth')

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

module.exports = router