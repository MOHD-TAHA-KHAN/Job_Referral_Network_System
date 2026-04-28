import express from 'express';
const router = express.Router()
import { 
  createReferral,
  getMyReferrals,
  getReferralById,
  updateReferralStatus,
  getReferralsForJob
 } from './referral.controller';
import {  protect  } from '../../middleware/auth';

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

export default router;