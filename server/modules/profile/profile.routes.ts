import express from 'express';
const router = express.Router()
import {  getProfile, updateProfile, getUsers  } from './profile.controller';
import {  protect  } from '../../middleware/auth';

// All profile routes are protected
router.use(protect)

router.get('/', getProfile)
router.patch('/', updateProfile)
router.get('/users', getUsers)

export default router
;