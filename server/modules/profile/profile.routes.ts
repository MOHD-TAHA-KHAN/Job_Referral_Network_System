import express from 'express';
const router = express.Router()
import {  getProfile, updateProfile, getUsers, getStats  } from './profile.controller';
import {  protect  } from '../../middleware/auth';

// All profile routes are protected
router.use(protect)

router.get('/', getProfile)
router.patch('/', updateProfile)

// Get profile statistics (requires authentication)
router.get('/stats', getStats)

// Get users with specific roles (requires authentication)
router.get('/users', getUsers)

export default router
;