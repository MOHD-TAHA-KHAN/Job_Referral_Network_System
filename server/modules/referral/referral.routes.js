const express = require('express')
const router = express.Router()
const {
  createReferral,
  getMyReferrals,
  getReferralById,
  updateReferralStatus,
  getReferralsForJob
} = require('./referral.controller')
const { protect } = require('../../middleware/auth')

// All referral routes require authentication
router.use(protect)

// Create a new referral request (Freshers only)
router.post('/', createReferral)

// Get user's referrals (both sent and received)
router.get('/my-referrals', getMyReferrals)

// Get specific referral details
router.get('/:id', getReferralById)

// Update referral status (Referrers only)
router.patch('/:id/status', updateReferralStatus)

// Get all referrals for a specific job (HR who created job or referrers)
router.get('/job/:jobId', getReferralsForJob)

module.exports = router